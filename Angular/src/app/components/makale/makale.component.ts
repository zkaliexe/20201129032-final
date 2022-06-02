import { Sonuc } from './../../models/Sonuc';
import { Yorum } from './../../models/Yorum';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Makale } from 'src/app/models/Makale';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MyAlertService } from 'src/app/services/myAlert.service';
import { MakaleFotoDialogComponent } from '../dialogs/makale-foto-dialog/makale-foto-dialog.component';

@Component({
  selector: 'app-makale',
  templateUrl: './makale.component.html',
  styleUrls: ['./makale.component.scss']
})
export class MakaleComponent implements OnInit {
 
  uyeId: number;
  makaleId: number;
  makale: Makale;
  yorumlar: Yorum[];
  dialogRefConfirm: MatDialogRef<ConfirmDialogComponent>;
  fotoDialogRef: MatDialogRef<MakaleFotoDialogComponent>;
  constructor(
    public apiServis: ApiService,
    public route: ActivatedRoute,
    public matDialog: MatDialog,
    public alert: MyAlertService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (p.makaleId) {
        this.makaleId = p.makaleId;
        this.MakaleById();
        this.MakaleYorumListe();
      }
      this.uyeId = parseInt(localStorage.getItem("uid"));

    });
  }
  

  MakaleById() {
    this.apiServis.MakaleById(this.makaleId).subscribe((d: Makale) => {
      this.makale = d;
      this.MakaleOkunduYap();
    });
  }
  MakaleOkunduYap() {
    this.makale.Okunma += 1;
    this.apiServis.MakaleDuzenle(this.makale).subscribe();
  }

  MakaleYorumListe() {
    this.apiServis.YorumListeBymakaleId(this.makaleId).subscribe((d: Yorum[]) => {
      this.yorumlar = d;
    });
  }

  YorumEkle(yorumMetni: string) {
    var yorum: Yorum = new Yorum();
    var uyeId: number = parseInt(localStorage.getItem("uid"));
    yorum.MakaleId = this.makaleId;
    yorum.UyeId = uyeId;
    yorum.YorumIcerik = yorumMetni;
    yorum.Tarih = new Date();

    this.apiServis.YorumEkle(yorum).subscribe((d: Sonuc) => {
      if (d.islem) {
        this.MakaleYorumListe();
      }
    });
  }
  YorumSil(kayit: Yorum) {
    this.dialogRefConfirm = this.matDialog.open(ConfirmDialogComponent, {
      width: '400px',
    });
    this.dialogRefConfirm.componentInstance.dialogMesaj = kayit.YorumIcerik + " Başlıklı Yorum Silinecektir Onaylıyor musunuz?";

    this.dialogRefConfirm.afterClosed().subscribe(d => {
      if (d) {
        this.apiServis.YorumSil(kayit.YorumId).subscribe((s: Sonuc) => {
          this.alert.AlertUygula(s);
          if (s.islem) {
            this.MakaleYorumListe();
          }
        });
      }
    });
  }

  FotoGuncelle(makale: Makale) {
    var yeniKayit = new Makale();
    this.fotoDialogRef = this.matDialog.open(MakaleFotoDialogComponent, {
      width: "400px",
      data: makale
    });

    this.fotoDialogRef.afterClosed().subscribe(d => {
      if (d) {
        d.makaleId = makale.MakaleId;
        this.apiServis.MakaleFotoGuncelle(d).subscribe(s => {
          this.alert.AlertUygula(s);
          if (s.islem) {
            this.MakaleById();
          }
        });
      }
    });
  }
}
