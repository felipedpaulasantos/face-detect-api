import { personGroupController } from '../controller';
import { wrapAsync } from '../infra';

export function personGroupRoutes(app: any): void {

    let appName =  app.get('title');
    let appVersion = app.get('version');

    app.route(`/${appName}/${appVersion}/grupo-pessoas/`)
        .get(wrapAsync(personGroupController.listAllGroups));

    app.route(`/${appName}/${appVersion}/grupo-pessoas/:personGroupId`)
        .get(wrapAsync(personGroupController.getPersonGroup))
        .put(wrapAsync(personGroupController.createPersonGroup))
        .patch(wrapAsync(personGroupController.updatePersonGroup))
        .delete(wrapAsync(personGroupController.removePersonGroup));

    app.route(`/${appName}/${appVersion}/grupo-pessoas/:personGroupId/train`)
        .get(wrapAsync(personGroupController.getTrainingStatus))
        .post(wrapAsync(personGroupController.trainPersonGroup));
};