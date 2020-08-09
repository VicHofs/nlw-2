import { Request, Response } from 'express';

import db from '../database/connection';
import hoursToMinutes from '../utils/hoursToMinutes';

interface ScheduleItem {
	day: number;
	from: string;
	to: string;
}

export default class ClassController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const subject = filters.subject as string;
    const day = filters.day as string;
    const time = filters.time as string;

    if (!filters.subject || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: 'Missing search filters'
      })
    }

    const timeInMinutes = hoursToMinutes(time);

    const classes = await db('classes').whereExists(function() {
      this.select('class_schedule.*').from('class_schedule')
      .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
      .whereRaw('`class_schedule`.`day` = ??', [Number(day)])
      .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
      .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
    }).where('classes.subject', '=', subject).join('users', 'classes.user_id', '=', 'users.id').select(['classes.*', 'users.*']);

    return response.json(classes);
  }


  async create(request: Request, response: Response) {
    const { name, avatar, whatsapp, bio, subject, cost, schedule } = request.body;
  
    const trx = await db.transaction();
  
    try {
      const insertedUserIds = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio,
      });
      
      const user_id = insertedUserIds[0];
    
      const insertedClassIds = await trx('classes').insert({
        subject,
        cost,
        user_id
      });
    
      const class_id = insertedClassIds[0];
    
      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          day: scheduleItem.day,
          from: hoursToMinutes(scheduleItem.from),
          to: hoursToMinutes(scheduleItem.to)
        };
      })
    
      await trx('class_schedule').insert(classSchedule);
    
      await trx.commit();
    
      return response.status(201).send();
    } catch(err) {
      await trx.rollback();
  
      return response.status(400).json({
        error: 'Unexpected error creating new class'
      })
    }
  }
}