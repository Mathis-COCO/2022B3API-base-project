import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "../../projects/entity/project.entity";
// import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string; //au format uuidv4
  @Column({unique: true})
  username!: string; // cette propriété doit porter une contrainte d'unicité
  @Column({unique: true})
  email!: string; // cette propriété doit porter une contrainte d'unicité
  @Column({nullable: false})
  password: string;
  @Column({ default: 'Employee' })
  role: 'Employee' | 'Admin' | 'ProjectManager'; // valeur par defaut : 'Employee'
  @OneToMany(type => Project, project => project.referringEmployee)
  projects!: Project[];
}
