import { Person, PersonGroup, Face } from "../models";
import { DatabaseError } from "../custom-errors";

export class PersonDao {

    private readonly _db: any;
    private readonly personConverter: Function;
    private readonly faceConverter: Function;
    private maxRows: number;

    constructor(db:any) {

        this._db = db;

        this.personConverter = function(row: any) {
            return {
                id: row.photo_id,
                createDate: new Date(),
                name: row.person_name,
                userData: row.person_user_data,
                groupId: row.group_id,
                faces: row.faces
            }
        };
        
        this.faceConverter = function(row: any) {
            return {
                createDate: row.create_date,
                userData: row.user_data,
                target: row.target
            }
        };
        
        this.maxRows = 12;
    }

    listAllFromGroup(groupId: string, page: number) {

        const from = (page - 1) * this.maxRows;

        let limitQuery = '';

        if (page) limitQuery = `LIMIT ${from}, ${this.maxRows}`;

        return new Promise<Person[]>((resolve, reject) => {
            this._db.all(`
                SELECT  p.*,
                        (SELECT COUNT(f.face_id) 
                            FROM person_face as f 
                            WHERE f.person_id = p.person_id
                         ) as faces, 
                FROM person AS p
                        JOIN
                        person_group AS g ON p.group_id = g.group_id
                WHERE g.group_id = ?
                ORDER BY p.person_create_date DESC
                ${limitQuery} ;
                `,
                [groupId],
                (err: Error, rows: any) => {
                    if (!rows || rows.length == 0) {
                        return reject(new DatabaseError('Não foram encontradas Pessoas neste Grupo', 404, err));
                    }
                    if (err) {
                        return reject(new DatabaseError('Não foi possível listar as Pessoas deste Grupo', 400, err));
                    }
                    const persons = rows.map(this.personConverter)

                    resolve(persons);
                });
        });
    }

    addPerson(person: Person, groupId: string) {
        return new Promise((resolve, reject) => {
            this._db.run(`
                INSERT INTO person (
                    person_id,
                    person_create_date,
                    person_name,
                    person_user_data,
                    group_id
                ) values (?,?,?,?,?)
            `,
            [
                person.id,
                new Date(),
                person.name,
                person.userData,
                groupId
            ],
            function (err: Error) {
                if (err) {
                    return reject( new DatabaseError(`Não foi possível gravar a Person ${person.name}`, 400, err));
                }
                resolve();
            });
        });
    }

    findPersonById(id: string) {

        return new Promise((resolve, reject) => this._db.get(`
            SELECT  p.*,
                    (SELECT COUNT(f.face_id) 
                        FROM person_face as f 
                        WHERE f.person_id = p.person_id
                    ) as faces, 
            FROM person AS p
            WHERE p.person_id = ?
            ORDER BY p.person_create_date DESC;
            `,
            [id],
            (err: Error, row: Person) => {
                if (!row) {
                    reject(new DatabaseError("Não foi encontrada nenhuma Pessoa com este id", 404))
                }
                if (err) {
                    reject(new DatabaseError(`Não foi possível encontrar a Pessoa ${id}`, 400, err));
                }
                resolve(this.personConverter(row));
            }
        ));
    }

    removePerson(id: string) {
        return new Promise((resolve, reject) => this._db.run(
            `DELETE FROM person where person_id = ?`,
            [id],
            function(err: Error) {
                if (err) {
                    return reject( new DatabaseError(`Não foi possível remover a person ${id}`, 400, err));
                }
                resolve();
            }
        ));
    }

    updatePerson(person_id: string, person: Person) {
        return new Promise((resolve, reject) => {
            this._db.run(`
                    UPDATE person SET 
                        person_name = ?,
                        person_user_data = ?
                    WHERE person_id = ?
                `,
                [
                    person.name,
                    person.userData,
                    person_id
                ],
                function (err: Error) {
                    if (err) {
                        return reject( new DatabaseError(`Não foi possível atualizar a Person ${person.name}`, 400, err));
                    }
                    resolve();
                });
        });
    }

    addFace(face: Face, personId: string) {

        return new Promise((resolve, reject) => {
            this._db.run(`
                    INSERT INTO person_face (
                        face_id, 
                        face_create_date, 
                        face_user_data,
                        face_target,
                        person_id
                    ) values (?,?,?,?, ?)
                `,
                [
                    face.id,
                    face.createDate,
                    face.userData,
                    face.target,
                    personId,
                ],
                function (err: Error) {
                    if (err) {
                        reject( new DatabaseError(`Não foi possível adicionar a face ${face.id}.`, 400, err) );
                    }
                    resolve();
                });
        });
    }

    getFacesFromPerson(personId: string) {

        return new Promise((resolve, reject) => {
            this._db.all(
                `
                SELECT 
                    f.create_date, f.user_data, f.target 
                FROM person_face as f
                    JOIN person as p ON p.person_id = f.person_id 
                WHERE f.person_id = ? 
                ORDER BY c.comment_date DESC  
                `,
                [personId],
                (err: Error, rows: any) => {
                    if (!rows) {
                        return reject( new DatabaseError(`Não foi encontrada nenhuma pessoa com este id`, 404));
                    }
                    if (err) {
                        return reject( new DatabaseError(`Não foi possível pegar as faces da Person ${personId}`, 400, err));
                    }
                    const faces = rows.map(this.faceConverter);
                    return resolve(faces);
                }
            );

        });
    }

    findFaceById(faceId: string) {

        return new Promise((resolve, reject) => {
            this._db.get(
                `
                SELECT 
                    f.create_date, f.user_data, f.target 
                FROM person_face as f
                JOIN person as p ON p.person_id = f.person_id 
                WHERE f.face_id = ? 
                `,
                [faceId],
                (err: Error, row: any) => {
                    if (!row) {
                        return reject( new DatabaseError(`Não foi possível encontrar nenhuma face`, 404, err));
                    }
                    if (err) {
                        return reject( new DatabaseError(`Não foi possível encontrar a face ${faceId}`, 400, err));
                    }
                    return resolve(this.faceConverter(row));
                }
            );

        });
    }

    removePersonFace(id: string) {
        return new Promise((resolve, reject) => this._db.run(
            `DELETE FROM person_face where face_id = ?`,
            [id],
            function(err: Error) {
                if (err) {
                    return reject( new DatabaseError(`Não foi possível remover a face ${id}`, 400, err));
                }
                resolve();
            }
        ));
    }

}