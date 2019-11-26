import { Request, Response } from 'express-serve-static-core';

import { utils, DetectedFaceDao } from '../infra';
import { faceDetectApi } from '../api';
import { ImageFile, DetectedFace } from '../models';
import { ApiResponseError, FileError, BusinessError } from '../custom-errors';
import { DetectionAttributes } from 'models/detection-attributes';

class FaceDetectController {

	constructor() {}

	async detect(req: any, res: Response) {

		const returnFaceId: boolean =
			(req.query.retornaId && req.query.retornaId == 'true') ? true : false;
		const returnFaceLandmarks: boolean =
			(req.query.retornaPontosReferencia && req.query.retornaPontosReferencia == 'true') ? true : false;
		const returnRecognitionModel: boolean = 
			(req.query.retornaModeloReconhecimento && req.query.retornaModeloReconhecimento == 'true') ? true : false;

		try {

			let imageFile = await utils.extractImageFromRequest(req);
			let apiResponse: DetectedFace[] | any = await faceDetectApi.detect(<ImageFile>imageFile, returnFaceId, returnFaceLandmarks, returnRecognitionModel);

			if (!apiResponse) {
				throw new ApiResponseError('Resposta inválida da API', 400);
			}

			if (apiResponse && apiResponse.error) {
				throw new ApiResponseError(apiResponse.error.message, 400, apiResponse.error);
			}

			if (apiResponse && apiResponse.length == 0) {
				throw new BusinessError('Nenhuma face detectada', 422);
			}

			const detectedFaceDao = new DetectedFaceDao(req.db);
			const databaseInsertPromises: any[] = [];
			let face: DetectedFace;

			apiResponse.forEach((detectedFace: DetectionAttributes) => {
				face = {
					id: detectedFace.faceId,
					createDate: new Date(),
					faceAttributes: detectedFace.faceAttributes,
					faceRectangle: detectedFace.faceRectangle,
					faceLandmarks: detectedFace.faceLandmarks,
					url: imageFile.imageUrl
				};
				databaseInsertPromises.push(detectedFaceDao.addFace(face));
			});

			await Promise.all(databaseInsertPromises);
			res.status(200).json(apiResponse);

		} catch (err) { res.status(err.status).json( err.toJson() ); }
	}

	async listFaces(req: any, res: any) {

		await new DetectedFaceDao(req.db).listAll()
			.then((detectedFaces: DetectedFace[]) => res.status(200).json(detectedFaces))
			.catch((err: any) => res.status(err.status).json( err.toJson() ));
	}

	async identify(req: Request, res: Response) {

		try {

			let faceIds = req.body.faceIds;
			let personGroupId = req.body.personGroupId;
			let maxNumOfCandidatesReturned = req.body.maxNumOfCandidatesReturned;
			let confidenceThreshold = req.body.confidenceThreshold;

			let apiResponse = await faceDetectApi.identify(
				faceIds, personGroupId, maxNumOfCandidatesReturned, confidenceThreshold
			);

			if (apiResponse.error) {
				throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
			}

			console.log(`Faces enviadas para identificação no grupo ${personGroupId}`);
			res.status(200).json(apiResponse);

		} catch (err) { res.status(err.status).json( err.toJson() ); }
	}

	async verifyFaceToPerson(req: Request, res: Response) {

		try {

			let personGroupId = req.body.personGroupId;
			let personId = req.body.personId;
			let faceId = req.body.faceId;

			let apiResponse = await faceDetectApi.verifyFaceToPerson(personGroupId, personId, faceId);

			if (apiResponse.error) {
				throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
			}

			console.log(`Face ${faceId} enviada para comparação com a Pessoa ${personId}`);
			res.status(200).json(apiResponse);

		} catch (err) { res.status(err.status).json( err.toJson() ); }
	}

	async verifyFaceToFace(req: Request, res: Response) {

		try {

			let faceId1 = req.body.faceId1;
			let faceId2 = req.body.faceId2;

			let apiResponse = await faceDetectApi.verifyFaceToFace(faceId1, faceId2);

			if (apiResponse.error) {
				throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
			}

			console.log(`Faces enviadas para comparação`);
			res.status(200).json(apiResponse);

		} catch (err) { res.status(err.status).json( err.toJson() ); }
	}

	async group(req: Request, res: Response) {

		try {

			let faceIds = req.body.faceIds;
			let apiResponse = await faceDetectApi.group(faceIds);

			if (apiResponse.error) {
				throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
			}

			console.log(`Faces encaminhadas para agrupamento.`);
			res.status(200).json(apiResponse);

		} catch (err) { res.status(err.status).json( err.toJson() ); }
	}

	async compare(req: Request, res: Response) {

		try {

			let imageFile = await utils.extractImageFromRequest(req);
			let apiResponse = await faceDetectApi.detect(<ImageFile>imageFile);

			if (apiResponse && apiResponse.error) {
				throw new ApiResponseError(apiResponse.error.message, apiResponse.error);
			}

			if (!apiResponse) {
				throw new ApiResponseError('Resposta inválida da API', apiResponse.error);
			}

			if (apiResponse.length === 1) {
				throw new FileError('Apenas uma face foi identificada!', 422);
			}

			if (apiResponse.length > 2) {
				throw new FileError('Mais de duas faces foram identificadas!', 422);
			}

			const faces: string[] = [];
			apiResponse.forEach((detectedFace: DetectionAttributes) => {
				faces.push(detectedFace.faceId);
			});

			faceDetectApi.verifyFaceToFace(faces[0], faces[1])
				.then((response: any) => {

					if (response.error) {
						throw new ApiResponseError(response.error.message, response.error);
					}
					return res.status(200).json(response);
				});

		} catch (err) { res.status(err.status).json( err.toJson() ); }
	}

}

const faceDetectController = new FaceDetectController();
export { faceDetectController };
