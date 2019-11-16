import { DetectedFace } from "../models";
import { DatabaseError } from "../custom-errors";

export class DetectedFaceDao {

    private readonly _db: any;
    private readonly faceConverter: Function;

    constructor(db: any) {

        this._db = db;
        
        this.faceConverter = function(row: any) {
            return <DetectedFace>{
                id: row.face_id,
                createDate: new Date(row.face_create_date),
                faceAttributes: JSON.parse(row.face_attributes),
                faceLandmarks: JSON.parse(row.face_landmarks),
                faceRectangle: JSON.parse(row.face_rectangle),
                url: row.image_url
            }
        };

    }

    listAll() {

        return new Promise<DetectedFace[]>((resolve, reject) => {
            this._db.all(
                `SELECT * FROM detected_face ORDER BY face_create_date DESC`,
                (err: any, rows: any) => {
                    if (err || !rows) {
                        return reject( new DatabaseError('Não foi possível retornar as faces.', 400, err));
                    }
                    const faces: DetectedFace[] = rows.map(this.faceConverter)
                    resolve(faces);
                });
        });
    }

    addFace(detectedFace: DetectedFace) {

        return new Promise((resolve, reject) => {
            this._db.run(
                `
                    INSERT INTO detected_face (
                        face_id, 
                        face_create_date,
                        face_attributes,
                        face_rectangle,
                        face_landmarks,
                        image_url
                    ) values (?,?,?,?,?,?)
                `,
                [
                    detectedFace.id,
                    detectedFace.createDate,
                    JSON.stringify(detectedFace.faceAttributes),
                    JSON.stringify(detectedFace.faceRectangle),
                    JSON.stringify(detectedFace.faceLandmarks),
                    detectedFace.url
                ],
                function(err: Error) {
                    if (err) 
                        return reject(new DatabaseError(`Não foi possível gravar a face ${detectedFace.id}.`, 400, err));                 
                    resolve();
                });
        });
    }

    findFaceById(faceId: string) {

        return new Promise((resolve, reject) => {
            this._db.get(
                `
                SELECT 
                    f.face_create_date, f.user_data, f.target 
                FROM face as f
                JOIN person as p ON p.person_id = f.person_id 
                WHERE f.face_id = ? 
                `,
                [faceId],
                (err: any, row: any) => {
                    if (err || !row) {
                        return reject( new DatabaseError(`Não foi possível encontrar a face ${faceId}`, 400, err));
                    }
                    resolve(this.faceConverter(row));
                }
            );

        });
    }

    removePersonFace(id: string) {
        return new Promise((resolve, reject) => this._db.run(
            `DELETE FROM detected_face where face_id = ?`,
            [id],
            function(err: any) {
                if (err) {
                    return reject( new DatabaseError(`Não foi possível remover a face ${id}`, 400, err));
                }
                resolve();
            }
        ));
    }

}