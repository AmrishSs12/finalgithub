import { Injectable,inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AppGlobalService } from '@baseapp/app-global.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AppHomeBaseService {

  public appGlobalService = inject(AppGlobalService);
 
  

  config : any = [ {
  "expanded" : false,
  "folder" : true,
  "data" : {
    "properties" : { }
  },
  "children" : [ {
    "expanded" : false,
    "folder" : true,
    "data" : {
      "properties" : {
        "detailPagePopupWidth" : 70,
        "defaultDetailPageEnabled" : false,
        "tileType" : "type_1",
        "outline" : false,
        "autoFillLookup" : false,
        "displayAsToggleSwitch" : false,
        "hideListPageTitle" : false,
        "enableLookup" : false,
        "label" : ""
      }
    },
    "children" : [ {
      "expanded" : false,
      "folder" : false,
      "data" : {
        "properties" : {
          "accessControl" : [ "App Admin" ],
          "defaultDetailPageEnabled" : false,
          "data" : "homeTile1",
          "label" : "Tile_1",
          "enableLookup" : false,
          "detailPagePopupWidth" : 70,
          "outline" : false,
          "field" : "homeTile",
          "autoFillLookup" : false,
          "displayAsToggleSwitch" : false,
          "hideListPageTitle" : false,
          "class" : "home-tile"
        }
      },
      "title" : "Tile 1",
      "type" : "homeTile",
      "selected" : false
    }, {
      "expanded" : false,
      "folder" : false,
      "data" : {
        "properties" : {
          "accessControl" : [ "App Admin" ],
          "defaultDetailPageEnabled" : false,
          "data" : "homeTile2",
          "label" : "Tile_2",
          "enableLookup" : false,
          "detailPagePopupWidth" : 70,
          "outline" : false,
          "field" : "homeTile",
          "autoFillLookup" : false,
          "displayAsToggleSwitch" : false,
          "hideListPageTitle" : false,
          "class" : "home-tile"
        }
      },
      "title" : "Tile 2",
      "type" : "homeTile",
      "selected" : false
    }, {
      "expanded" : false,
      "folder" : false,
      "data" : {
        "properties" : {
          "accessControl" : [ "App Admin" ],
          "defaultDetailPageEnabled" : false,
          "data" : "homeTile3",
          "label" : "Tile_3",
          "enableLookup" : false,
          "detailPagePopupWidth" : 70,
          "outline" : false,
          "field" : "homeTile",
          "autoFillLookup" : false,
          "displayAsToggleSwitch" : false,
          "hideListPageTitle" : false,
          "class" : "home-tile"
        }
      },
      "title" : "Tile 3",
      "type" : "homeTile",
      "selected" : false
    }, {
      "expanded" : false,
      "folder" : false,
      "data" : {
        "properties" : {
          "accessControl" : [ "App Admin" ],
          "defaultDetailPageEnabled" : false,
          "data" : "homeTile4",
          "label" : "Tile_4",
          "enableLookup" : false,
          "detailPagePopupWidth" : 70,
          "outline" : false,
          "field" : "homeTile",
          "autoFillLookup" : false,
          "displayAsToggleSwitch" : false,
          "hideListPageTitle" : false,
          "class" : "home-tile"
        }
      },
      "title" : "Tile 4",
      "type" : "homeTile",
      "selected" : false
    }, {
      "expanded" : false,
      "folder" : false,
      "data" : {
        "properties" : {
          "accessControl" : [ "App Admin" ],
          "defaultDetailPageEnabled" : false,
          "data" : "homeTile5",
          "label" : "Tile_5",
          "enableLookup" : false,
          "detailPagePopupWidth" : 70,
          "outline" : false,
          "field" : "homeTile",
          "autoFillLookup" : false,
          "displayAsToggleSwitch" : false,
          "hideListPageTitle" : false,
          "class" : "home-tile"
        }
      },
      "title" : "Tile 5",
      "type" : "homeTile",
      "selected" : false
    }, {
      "expanded" : false,
      "folder" : false,
      "data" : {
        "properties" : {
          "accessControl" : [ "App Admin" ],
          "defaultDetailPageEnabled" : false,
          "data" : "homeTile6",
          "label" : "Tile_6",
          "enableLookup" : false,
          "detailPagePopupWidth" : 70,
          "outline" : false,
          "field" : "homeTile",
          "autoFillLookup" : false,
          "displayAsToggleSwitch" : false,
          "hideListPageTitle" : false,
          "class" : "home-tile"
        }
      },
      "title" : "Tile 6",
      "type" : "homeTile",
      "selected" : false
    } ],
    "title" : "Home Page",
    "type" : "homePage",
    "key" : "homePage",
    "selected" : false
  } ],
  "title" : "Page",
  "type" : "page",
  "key" : "page",
  "selected" : false
} ];
  
 currentUserRoles = (this.appGlobalService.getCurrentUserData()).userRoles;
 checkAccess: any = (o: string) => this.currentUserRoles.includes(o);

  public getLandingPageData() {
    let accessibleData: any = {
      children: []
    };
    const data: any = (this.config.find((t: { type: string; }) => t.type === "page"))?.children[0];
    if (!environment.prototype) {
      data.children?.filter((tileProps: any) => {
        const tile = tileProps.data?.properties;
        if (tile.accessControl && tile.accessControl.length > 0) {
          if(!this.currentUserRoles){
            this.currentUserRoles = (this.appGlobalService.getCurrentUserData()).userRoles;
          }
          if (tile.accessControl.some(this.checkAccess) || tile.accessControl.includes('all'))
            accessibleData.children.push(tileProps);
        }
        else {
          accessibleData.children.push(tileProps);
        }
      })
      accessibleData = { ...data, ...accessibleData };
    }
    else {

      accessibleData = data;
    }
    return accessibleData;
  }
}