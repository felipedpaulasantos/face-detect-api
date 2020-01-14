import jimp from 'jimp';
import { FileError } from '../custom-errors';
import { ImageFile } from 'models/image-file';

class Utils {

	constructor() {}

	formatResponseBodyToJson(responseBody: any) {

		if (!responseBody) { return ''; }
		if (responseBody.constructor == Array || responseBody.constructor == Object) { return responseBody; }
		if (responseBody.constructor == String) { return JSON.parse(responseBody); }
	}

	async extractImageFromRequest(req: any): Promise<ImageFile> {

		let imageSrc: string | Buffer = '';
		let contentType = '';
		let imageUrl = '';

		if (!req || (!req.body && !req.body.url) || (!req && !req.file)) {
			throw new FileError('Arquivo inválido', 422);
		}

		if (req && req.body && req.body.url && req.file) {
			throw new FileError('A imagem deve ter apenas uma fonte: URL ou imageFile (arquivo local)', 422);
		}

		try {

			if (req && req.body && req.body.url) {

				imageSrc = `{"url": "${req.body.url}"}`;
				contentType = 'application/json';
				imageUrl = req.body.url;
			}

			if (req && req.file && req.file.path) {

				let image = await jimp.read(req.file.path);
				let imageBuffer = await image.getBufferAsync(image.getMIME());
				let imageBase64 = await image.getBase64Async(image.getMIME());

				imageSrc = imageBuffer;
				contentType = 'application/octet-stream';
				imageUrl = imageBase64;
			}

			const imageFile = { imageSrc, contentType, imageUrl };
			return imageFile;

		} catch (err) {
			throw new FileError(err.message, err)
		}
	}

}

const utils = new Utils();
export { utils };
