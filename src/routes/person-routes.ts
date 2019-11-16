import { personController } from '../controller';
import { wrapAsync } from '../infra';

export function personRoutes(app: any): void {

	let appName =  app.get(`title`);
	let appVersion = app.get('version');

	app.route(`/${appName}/${appVersion}/grupo-pessoas/:personGroupId/pessoas`)
		.get(wrapAsync(personController.listAllPersonsFromGroup))
		.post(wrapAsync(personController.createPerson));
		
	app.route(`/${appName}/${appVersion}/grupo-pessoas/:personGroupId/pessoas/:personId`)
		.get(wrapAsync(personController.getPerson))
		.patch(wrapAsync(personController.updatePerson))
		.delete(wrapAsync(personController.removePerson));

	app.route(`/${appName}/${appVersion}/grupo-pessoas/:personGroupId/pessoas/:personId/faces-persistidas`)
		.post(app.get(`upload`).single(`imageFile`), wrapAsync(personController.addPersonFace))
		.delete(wrapAsync(personController.removePersonFace));

	app.route(`/${appName}/${appVersion}/grupo-pessoas/:personGroupId/pessoas/:personId/faces-persistidas/:persistedFaceId`)
		.get(wrapAsync(personController.getPersonFace));
};