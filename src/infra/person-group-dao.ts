import { PersonGroup } from "../models";
import { DatabaseError } from "../custom-errors";

export class PersonGroupDao {

    private readonly _db: any;
    private readonly personGroupConverter: Function;

    constructor(db: any) {

        this._db = db;

        this.personGroupConverter = function(row: any) {
            return <PersonGroup> {
                id: row.group_id,
                name: row.group_name,
                createDate: new Date(row.group_create_date),
                userData: row.group_user_data,
                recognitionModel: row.group_recognition_model
            }
        }
    }

    listAll() {
        return new Promise<PersonGroup[]>((resolve, reject) => {
            this._db.all(
                `SELECT * FROM person_group ORDER BY group_create_date DESC`,
                (err: any, rows: any) => {
                    if (err || !rows) {
                        return reject( new DatabaseError(`Não foi possível listar os PersonGroups.`));
                    }
                    const person_groups = rows.map(this.personGroupConverter);
                    resolve(person_groups);
                });
        });
    }

    addPersonGroup(group: PersonGroup) {
        return new Promise((resolve, reject) => {
            this._db.run(`
                INSERT INTO person_group (
                    group_id,
                    group_create_date,
                    group_name,
                    group_user_data,
                    group_recognition_model
                ) values (?,?,?,?,?)
            `,
            [
                group.id,
                new Date(),
                group.name,
                group.userData,
                group.recognitionModel
            ],
            function (err: any) {
                if (err || !group.id) 
                    return reject( new DatabaseError(`Não foi possível adicionar o PersonGroup ${group.name}`));
                resolve(group.id);
            });
        });
    }

    updatePersonGroup(personGroupId: string, personGroup: PersonGroup) {
        return new Promise((resolve, reject) => {
            this._db.run(`
                    UPDATE person_group SET 
                        group_name = ?,
                        group_user_data = ?
                    WHERE group_id = ?
                `,
                [
                    personGroup.name,
                    personGroup.userData,
                    personGroupId
                ],
                function (err: any) {
                    if (err) 
                        return reject( new DatabaseError(`Não foi possível atualizar a PersonGroup ${personGroup.name}`));
                    resolve();
                });
        });
    }

    removePersonGroup(id: string) {
        return new Promise((resolve, reject) => this._db.run(
            
            'DELETE FROM person_group where group_id = ?',
            [id],
            function(err: any) {
                if (err) 
                    return reject( new DatabaseError(`Não foi possível remover o Person Group ${id}`));
                resolve();
            }

        ));
    }

}