import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { QueryRef } from 'apollo-angular';
import { EmptyObject } from 'apollo-angular/build/types';
import { take } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import * as graphOperations from '../../graphql-operations';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public account: any = {
    id: 0,
    firstName: '',
    lastName: '',
    avatar: '',
    group: '',
    groupId: 0,
    street: '',
    city: ''
  }
  public errors: any = this.initErrors();
  public loading: boolean = true;
  public queryAccount?: QueryRef<any, EmptyObject>;

  @ViewChild('editImageDialog')
  editImageDialog?: TemplateRef<any>;
  private editImageModal?: NgbModalRef;

  constructor(private modalService: NgbModal, private apiService: ApiService) { }

  public ngOnInit(): void {
    this.queryAccount = this.apiService.apollo.watchQuery<any>({ query: graphOperations.GET_MY_ACCOUNT });
    this.queryAccount.valueChanges
      .subscribe(({ data }) => {
        this.account = {
          id: data.getMyAccount.id,
          firstName: data.getMyAccount.first_name,
          lastName: data.getMyAccount.last_name,
          city: data.getMyAccount.city,
          street: data.getMyAccount.address,
          group: data.getMyAccount.Group.name,
          groupId: data.getMyAccount.Group.id,
          avatar: data.getMyAccount.avatar ?? ''
        };
        this.loading = false;
      });
  }

  public openImageModel(): void {
    this.editImageModal = this.modalService.open(this.editImageDialog, { centered: true });
  }

  public closeImageModal(): void {
    this.editImageModal?.close();
  }

  public deleteImage(): void {
    this.account.avatar = '';
  }

  public editAccount(): void {
    this.initErrors();
    const isValid = this.validateAccount();
    if (!isValid) {
      return;
    }

    this.apiService.apollo.mutate({ mutation: graphOperations.UPDATE_MY_ACCOUNT, 
      variables: {
        avatar: this.account?.avatar ?? '',
        city: this.account.city,
        address: this.account.street 
      }})
      .pipe(take(1))
      .subscribe({
        next: (_: any) => {
          this.queryAccount?.refetch();
        },
        error: (err: any) => {
          console.log(err);
        }});
  }

  public async onChange(event: any) {
    const file = event.target.files[0];
    this.account.avatar = await this.toBase64(file);
  }

  private toBase64(file: any): Promise<string | ArrayBuffer | null> {
      return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
  }

  private validateAccount(): boolean {
    let isValid = true;
    if (!this.account.city) {
      this.errors.address.city = 'Miasto nie może być puste';
      isValid = false;
    }

    if (!this.account.street) {
      this.errors.address.street = 'Ulica nie może być pusta';
      isValid = false;
    }

    return isValid;
  }

  private initErrors(): void {
    this.errors = {
      address: {
        city: '',
        street: ''
      }
    };
  }
}
