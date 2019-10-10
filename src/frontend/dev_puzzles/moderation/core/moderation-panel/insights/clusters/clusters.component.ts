import { Component, OnInit } from "@angular/core";
import { RimaAAAService } from "@colabo-rima/f-aaa/rima-aaa.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { InsightsService } from "../insights.service";
import { KNode } from "@colabo-knalledge/f-core/";
import { SDGsService } from "@colabo-sdg/core";

/* D3 solution: 
declare let d3: any;
const Radius: number = 500; //TODO: make screen-dependent
*/

@Component({
  selector: "clusters",
  templateUrl: "./clusters.component.html",
  styleUrls: ["./clusters.component.css"]
})
export class ClustersComponent implements OnInit {
  // protected canvas: any;

  public get clusters(): any[] {
    // console.log("this.sdgs_json", this.sdgs_json);
    return this.sdgs_json;
  }

  public userNick(userId: string): string {
    if (userId in this.usersById) {
      let email: string = this.usersById[userId].dataContent.email;
      return email.substring(0, email.indexOf("@"));
    } else {
      return "...";
    }
  }
  protected sdgs_json: any = [];
  /*
  [
    // "/assets/comm_files/sdg.json"
    {
      cluster_num: 1,
      members: [
        {
          user: "5d852e5ea23832b6fc8ef937",
          idea: [1, 4, 12]
        },
        {
          user: "5d90b1936791705010db6b57",
          idea: [14, 17, 8]
        },
        {
          user: "5d852e5ea23832b6fc8ef937",
          idea: [12, 5, 1]
        }
      ]
    },
    {
      cluster_num: 2,
      members: [
        {
          user: "5d852e5ea23832b6fc8ef937",
          idea: [3, 2, 14]
        },
        {
          user: "5d852e5ea23832b6fc8ef937",
          idea: [18, 11, 12]
        },
        {
          user: "5d90b1936791705010db6b57",
          idea: [5, 4, 6]
        }
      ]
    },
    {
      cluster_num: 3,
      members: [
        {
          user: "5d90b1936791705010db6b57",
          idea: [6, 7, 8]
        },
        {
          user: "5d90b1936791705010db6b57",
          idea: [18, 17, 9]
        },
        {
          user: "5d852e5ea23832b6fc8ef937",
          idea: [3, 6, 17]
        }
      ]
    },
    {
      cluster_num: 4,
      members: [
        {
          user: "5d90b1936791705010db6b57",
          idea: [13, 3, 17]
        },
        {
          user: "5d90b1936791705010db6b57",
          idea: [6, 4, 16]
        },
        {
          user: "5d852e5ea23832b6fc8ef937",
          idea: [3, 14, 6]
        }
      ]
    },
    {
      cluster_num: 5,
      members: [
        {
          user: "5d852e5ea23832b6fc8ef937",
          idea: [16, 4, 3]
        },
        {
          user: "5d90b1936791705010db6b57",
          idea: [3, 12, 13]
        },
        {
          user: "5d852e5ea23832b6fc8ef937",
          idea: [17, 16, 4]
        }
      ]
    }
  ];
  */

  protected extendedDisplay: boolean = false;
  protected users: KNode[];
  protected usersById: any = {};

  loadingRegisteredUsers: boolean;

  constructor(
    private rimaAAAService: RimaAAAService,
    private insightsService: InsightsService,
    private sDGsService: SDGsService,
    private http: HttpClient
  ) {
    this.getJSON().subscribe((data: string) => {
      console.log(data);
      this.sdgs_json = data; //JSON.parse(data);
    });
  }

  ngOnInit() {
    /* D3 solution: 
    this.createCanvas(Radius);
    this.createElements();
    */

    this.getRegisteredUsers();
  }

  public getJSON(): Observable<any> {
    return this.http.get("/assets/comm_files/sdg.json");
  }

  // get userById(id:string)

  protected getRegisteredUsers(forceRefresh: boolean = false): void {
    this.loadingRegisteredUsers = true;
    this.insightsService
      .getRegisteredUsers(forceRefresh)
      .subscribe(this.usersReceived.bind(this));
  }

  private usersReceived(users: KNode[]): void {
    //console.log('usersReceived', users);
    this.loadingRegisteredUsers = false;
    this.users = users;
    let usrId: string;
    let user: KNode;
    for (var i: number = 0; i < users.length; i++) {
      user = users[i];
      this.usersById[user._id] = user;
    }
  }

  /* D3 solution: 
  protected createCanvas(radius: number): any {
    // d3.selectAll('svg').remove();
    this.canvas = d3.select("#sdg-clusters-canvas");

    //TODO: not working - not stretching the parent DIV
    this.canvas
      .attr("width", radius * 2 + 150 + "px")
      .attr("height", radius * 2 + 150 + "px");

    return this.canvas;
  }

  createElements(): void {
    // var svg = d3.select("svg"),
    let diameter: number = 500; //TODO: this.canvas.attr("width");
    let g = this.canvas.append("g").attr("transform", "translate(2,2)");
    let format = d3.format(",d");

    var pack = d3.pack().size([diameter - 4, diameter - 4]);

    d3.json(this.sdgs_json, function(error, root) {
      if (error) {
        throw error;
      } //TODO: manage this better!
      console.log("[ClustersComponent::createElements] root", root);
      root = d3
        .hierarchy(root)
        .sum(function(d) {
          return 300;
        })
        .sort(function(a, b) {
          return b.value - a.value;
        });

      var node = g
        .selectAll(".node")
        .data(pack(root).descendants())
        .enter()
        .append("g")
        .attr("class", function(d) {
          return d.members ? "node" : "leaf node";
        })
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

      node
        .append("text")
        .attr("dy", "-8.5em")
        .attr("dx", "-7em")
        .attr("class", "num")
        .text(function(d) {
          return d.data.cluster_num;
        });

      node.append("title").text(function(d) {
        return "d.data.idea";
      });

      node.append("circle").attr("r", function(d) {
        return d.r;
      });

      node
        .filter(function(d) {
          return !d.members;
        })
        .append("text")
        .attr("dy", "0.3em")
        .text(function(d) {
          return d.data.user.substring(0, d.r / 3);
        });

      node
        .filter(function(d) {
          return !d.members;
        })
        .append("text")
        .attr("dy", "-1em")
        .attr("class", "name")
        .text(function(d) {
          // return d.data.name.substring(0, d.r / 3);
          return "name";
        }); //fullName
    });
  }
  */

  get isLoggedIn(): Boolean {
    return this.rimaAAAService.getUser() !== null;
  }

  // userImg():string{
  //   return 'assets/images/user_icons/performer.jpg';
  // }

  userName(): string {
    return this.rimaAAAService.getUser() !== null
      ? this.rimaAAAService.getUser().name
      : "not logged in";
  }

  public userAvatar(): Observable<string> {
    return RimaAAAService.userAvatar(this.rimaAAAService.getUser());
  }
}
