import { RimaAAAService } from '@colabo-rima/f-aaa/rima-aaa.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';

@Component({
  selector: 'user-selector',
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.css']
})
export class UserSelectorComponent implements OnInit {
  @Input() userData: KNode;

  myControl = new FormControl();
  // options: string[] = ['One', 'Two', 'Three'];
  // filteredOptions: Observable<string[]>;
  public options:KNode[]
   = [];
  //  = [
  //   {name: 'Mary'},
  //   {name: 'Shelley'},
  //   {name: 'Igor'}
  // ];
  filteredOptions: Observable<KNode[] | string[]>;
  
  protected userNames:string[] = [];

  constructor(
    private rimaAAAService: RimaAAAService
  ) { }

  ngOnInit() {
    this.rimaAAAService.getUsersInActiveMap().subscribe(this.usersInActiveMapReceived.bind(this));
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | KNode>('')
        //if not a string [user.name], we convert it from Object [KNode] to string:
        ,map(value => typeof value === 'string' ? value : value.name) 
        //if 'name' is existing we filter array of objects for those having that name, otherwise we return all the objects:
        ,map(name => name ? this._filter(name) : this.options.slice())
      );
      // .pipe(
      //   startWith(''),
      //   map(value => this._filter(value))
      // );
  }

  displayFn(user?: KNode): string | undefined {
    return user ? user.name : undefined;
  }

  usersInActiveMapReceived(users:KNode[]):void{
    this.options = users;
    for(var u:number=0; u<users.length; u++){
      this.userNames.push(users[u].name);
    }
    // this.options.sort();
  }

  private _filter(value: string): KNode[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  public optionImg(option:KNode):Observable<string>{
    return RimaAAAService.userAvatar(option);
  }

  public optionDetails(option:KNode):string{
    return ('dataContent' in option) ? (option.dataContent.email) : '';
  }
  


  // assignRegisteredUsers(users:any):void{
  //   console.log('assignRegisteredUsers', users);
  //   this.registeredUsers = users;
  // }

}
