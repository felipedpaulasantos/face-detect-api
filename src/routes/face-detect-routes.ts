import { faceDetectController } from '../controller';
import { wrapAsync } from '../infra';

export function faceDetectRoutes(app: any): void {

	const appName =  app.get('title');
	const appVersion = app.get('version');

	app.route(`/${appName}/${appVersion}/detectar`)
		.post(
			app.get('upload').single('arquivoImagem'),
			wrapAsync(faceDetectController.detect)
		);

	app.route(`/${appName}/${appVersion}/faces-detectadas`)
		.get(wrapAsync(faceDetectController.listFaces));

	app.route(`/${appName}/${appVersion}/identificar`)
		.post(wrapAsync(faceDetectController.identify));

	app.route(`/${appName}/${appVersion}/agrupar`)
		.post(wrapAsync(faceDetectController.group));

	app.route(`/${appName}/${appVersion}/verificar-pessoa`)
			.post(wrapAsync(faceDetectController.verifyFaceToPerson));

	app.route(`/${appName}/${appVersion}/verificar-faces`)
			.post(wrapAsync(faceDetectController.verifyFaceToFace));

	app.route(`/${appName}/${appVersion}/comparar`)
		.post(
			app.get('upload').single('arquivoImagem'),
			wrapAsync(faceDetectController.compare)
		);
}
