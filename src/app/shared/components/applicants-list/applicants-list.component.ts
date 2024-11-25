import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Applicant } from 'src/app/models/applicant.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-applicants-list',
  templateUrl: './applicants-list.component.html',
  styleUrls: ['./applicants-list.component.scss']
})
export class ApplicantsListComponent implements OnInit {
  @Input() eventId: string;
  applicants: Applicant[] = [];

  constructor(
    private firebaseSvc: FirebaseService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadApplicants();
  }

  async loadApplicants() {
    const path = `events/${this.eventId}/applicants`;
    const applicantsData = await firstValueFrom(this.firebaseSvc.getCollectionData(path));
    this.applicants = applicantsData.map((data: any) => ({
      id: data.id,
      email: data.email,
      image: data.image,
      name: data.name,
      rating: data.rating || 0
    }));
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}