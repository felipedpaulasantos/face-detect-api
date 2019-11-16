import { apiService } from '../infra';
import { ImageFile, Person, PersonGroup } from '../models';

class FaceDetectApi {

	private subscriptionKey: string;
	private baseUri: string;
	private baseOptions: any;
	private detectionParameters: any;

	constructor() {

		this.subscriptionKey = '59a065ff7c3f4fad858ca450b90e9daa';
		this.baseUri = 'https://face-detect.cognitiveservices.azure.com/face/v1.0/';
		this.baseOptions = {
			uri: this.baseUri,
			headers: {
				'Content-Type': 'application/json',
				'Ocp-Apim-Subscription-Key' : this.subscriptionKey
			}
		};
		this.detectionParameters = {
			returnFaceId: true,
			returnFaceLandmarks: false,
			returnFaceAttributes: `age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise`,
			recognitionModel: 'recognition_02',
			returnRecognitionModel: false,
			detectionModel: 'detection_01'
		};
	}

	async detect(imageFile: ImageFile, returnFaceId?: boolean, returnFaceLandmarks?: boolean, returnRecognitionModel?: boolean) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + 'detect';
		options.method = 'POST';
		options.qs = this.detectionParameters;
		options.qs.returnFaceId = returnFaceId;
		options.qs.returnFaceLandmarks = returnFaceLandmarks;
		options.qs.returnRecognitionModel = returnRecognitionModel;

		options.body = imageFile.imageSrc;
		options.headers['Content-Type'] = imageFile.contentType;

		let response = await apiService.doRequest(options);
		return response;
	}

	async identify(faceIds: string, personGroupId: string, maxNumOfCandidatesReturned: number, confidenceThreshold: number) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + 'identify';
		options.method = 'POST';
		options.body = { faceIds, personGroupId, maxNumOfCandidatesReturned, confidenceThreshold };
		options.json = true;

		let response = await apiService.doRequest(options);
		return response;
	}

	async verifyFaceToPerson(personGroupId: string, personId: string, faceId: string) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + 'verify';
		options.method = 'POST';
		options.body = { personGroupId, personId, faceId };
		options.json = true;

		let response = await apiService.doRequest(options);
		return response;
	}

	async verifyFaceToFace(faceId1: string, faceId2: string) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + 'verify';
		options.method = 'POST';
		options.body = { faceId1, faceId2 };
		options.json = true;

		let response = await apiService.doRequest(options);
		return response;
	}

	async group(faceIds: string[]) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + 'group';
		options.method = 'POST';
		options.body = { faceIds };
		options.json = true;

		let response = await apiService.doRequest(options);
		return response;
	}

	async createPersonGroup(personGroupId: string, group: PersonGroup) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}`;
		options.method = 'PUT';
		options.body = group;
		options.json = true;

		let response = await apiService.doRequest(options);
		return response;
	}

	async updatePersonGroup(personGroupId: string, personGroup: PersonGroup) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}`;
		options.method = 'PATCH';
		options.body = personGroup;
		options.json = true;

		let response = await apiService.doRequest(options);
		return response;
	}

	async getPersonGroup(personGroupId: string) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}`;

		let response = await apiService.doRequest(options);
		return response;
	}

	async removePersonGroup(personGroupId: string) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}`;
		options.method = 'DELETE';

		let response = await apiService.doRequest(options);
		return response;
	}

	async trainPersonGroup(personGroupId: string) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}/train`;
		options.method = 'POST';

		let response = await apiService.doRequest(options);
		return response;
	}

	async getTrainingStatus(personGroupId: string) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}/training`;

		let response = await apiService.doRequest(options);
		return response;
	}

	async listAllGroups() {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups`;

		let response = await apiService.doRequest(options);
		return response;
	}

	async createPerson(personGroupId: string, person: Person) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}/persons`;
		options.method = 'POST';
		options.body = person;
		options.json = true;

		let response = await apiService.doRequest(options);
		return response;
	}

	async getPerson(personGroupId: string, personId: string) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}/persons/${personId}`;

		let response = await apiService.doRequest(options);
		return response;
	}

	async updatePerson(personGroupId: string, personId: string, person: Person) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}/persons/${personId}`;
		options.method = 'PATCH';
		options.body = person;
		options.json = true;

		let response = await apiService.doRequest(options);
		return response;
	}

	async removePerson(personGroupId: string, personId: string) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}/persons/${personId}`;
		options.method = 'DELETE';

		let response = await apiService.doRequest(options);
		return response;
	}

	async listAllPersonsFromGroup(personGroupId: string) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}/persons`;

		let response = await apiService.doRequest(options);
		return response;
	}

	async addPersonFace(personGroupId: string, personId: string, imageFile: ImageFile) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}/persons/${personId}/persistedFaces`;
		options.method = 'POST';
		options.body = imageFile.imageSrc;
		options.headers['Content-Type'] = imageFile.contentType;

		let response = await apiService.doRequest(options);
		return response;
	}

	async getPersonFace(personGroupId: string, personId: string, faceId: string) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}/persons/${personId}/persistedFaces/${faceId}`;

		let response = await apiService.doRequest(options);
		return response;
	}

	async removePersonFace(personGroupId: string, personId: string, faceId: string) {

		let options = JSON.parse(JSON.stringify(this.baseOptions));
		options.uri = this.baseOptions.uri + `persongroups/${personGroupId}/persons/${personId}/persistedFaces/${faceId}`;
		options.method = 'DELETE';

		let response = await apiService.doRequest(options);
		return response;
	}

}

const faceDetectApi = new FaceDetectApi();
export{ faceDetectApi };
