import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor() {}

  getCourses(): Observable<Course[]> {
    // Mock temporaneo
    return of<Course[]>([
      {
        id: 1,
        nom: 'Éducation Chiot',
        description: 'Cours pour chiots de 2 à 6 mois.',
        capacite_max: 10,
        statut: 'Actif',
        niveau: 'Débutant',
        id_type_cours: 1,
        id_tranche: 1,
        imageUrl: 'URL_IMMAGINE_CHIOT'
      },
      {
        id: 2,
        nom: 'Agilité Adulte',
        description: 'Initiation à l’agilité pour chiens adultes.',
        capacite_max: 8,
        statut: 'Actif',
        niveau: 'Intermédiaire',
        id_type_cours: 2,
        id_tranche: 2,
        imageUrl: 'URL_IMMAGINE_AGILITE'
      },
      {
        id: 4,
        nom: 'Éducation Chiot Pelati',
        description: 'Cours pour chiots de 2 à 6 mois.',
        capacite_max: 9,
        statut: 'Actif',
        niveau: 'Débutant',
        id_type_cours: 1,
        id_tranche: 1,
        imageUrl: 'URL_IMMAGINE_CHIOT'
      },
    ]);
  }
}
