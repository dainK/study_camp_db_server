import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lecture } from './lecture.entity';
import { SpaceMember } from 'src/space-members/entities/space-member.entity';

@Entity('lecture_items')
export class LectureItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lecture, (lecture) => lecture.lecture_items)
  @JoinColumn({ name: 'lecture_id' })
  lecture: Lecture;
  @Column({ type: 'int', nullable: false })
  lecture_id: number;

  @Column()
  title: string;

  @Column()
  url: string;
}
