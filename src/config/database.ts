import * as sqlite3 from 'sqlite3';

export class DatabaseConfig {

    public db: sqlite3.Database;

    constructor(){

        const sq = sqlite3.verbose();
        this.db = new sq.Database('data.db');

        const PERSON_GROUP_SCHEMA = 
        `
        CREATE TABLE IF NOT EXISTS person_group (
            group_id TEXT PRIMARY KEY UNIQUE,
            group_create_date TIMESTAMP NOT NULL DEFAULT current_timestamp, 
            group_name TEXT NOT NULL,
            group_user_data TEXT DEFAULT (''), 
            group_recognition_model TEXT DEFAULT ('recognition_02')
        )
        `;
    
        const PERSON_SCHEMA = 
        `
        CREATE TABLE IF NOT EXISTS person (
            person_id TEXT PRIMARY KEY UNIQUE,
            person_create_date TIMESTAMP NOT NULL DEFAULT current_timestamp, 
            person_name TEXT NOT NULL, 
            person_user_data TEXT DEFAULT (''), 
            group_id INTEGER,
            FOREIGN KEY(group_id) REFERENCES person_group(group_id) ON DELETE CASCADE 
        )
        `;
    
        const PERSON_FACE_SCHEMA = 
        `
        CREATE TABLE IF NOT EXISTS person_face (
            face_id TEXT PRIMARY KEY UNIQUE,
            face_create_date TIMESTAMP NOT NULL DEFAULT current_timestamp, 
            face_user_data TEXT DEFAULT (''), 
            face_target TEXT DEFAULT (''),
            person_id TEXT,
            FOREIGN KEY(person_id) REFERENCES person(person_id) ON DELETE CASCADE 
        )
        `;

        const DETECTED_FACE_SCHEMA = 
        `
        CREATE TABLE IF NOT EXISTS detected_face (
            face_id TEXT PRIMARY KEY UNIQUE,
            face_create_date TIMESTAMP NOT NULL DEFAULT current_timestamp,
            face_attributes TEXT,
            face_rectangle TEXT,
            face_landmarks TEXT,
            image_url TEXT
        )
        `;

        this.db.serialize(() => {
            this.db.run("PRAGMA foreign_keys=ON");
            this.db.run(PERSON_SCHEMA);
            this.db.run(PERSON_GROUP_SCHEMA);   
            this.db.run(PERSON_FACE_SCHEMA);
            this.db.run(DETECTED_FACE_SCHEMA)
        });
    
        process.on('SIGINT', () =>
            this.db.close(() => {
                console.info('Database closed');
                process.exit(0);
            })
        );
    }
}

const db = new DatabaseConfig().db;
export { db };