import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService{
 public Donneenom= signal('');
 public Donneeprenom= signal('');
 public Donneetitre= signal('');
 public Donneebio= signal('');
 public Donneeurl= signal('');
 public Donneeskills= signal('');


}