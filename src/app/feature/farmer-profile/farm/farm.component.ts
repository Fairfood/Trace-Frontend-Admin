/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IReference, PLOT_TYPES } from '../farmer-profile.config';
import { FarmerProfileService } from '../farmer-profile.service';
import { ICommonObj, IListWithIndex } from 'src/app/shared/configs/app.models';
import { DataService } from 'src/app/shared/services';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.scss'],
})
export class FarmComponent implements OnInit, OnDestroy {
  @Input() farmerData: any;
  farmList: any;
  pageApis: Subscription[] = [];
  plotArray: any[];
  activeId: number;
  activePlotDetails: any;
  loading = true;

  center: google.maps.LatLngLiteral;
  zoom = 10;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  map: google.maps.Map;
  mapDefaultOptions = {
    mapTypeControl: false,
    fullscreenControl: false,
  };
  geoJsonType = '';
  apiLoaded: Observable<boolean>;

  plotTypes: ICommonObj[] = PLOT_TYPES;

  constructor(
    private service: FarmerProfileService,
    private dataService: DataService
  ) {
    // this.dataService.loadGoogleMaps();
  }

  ngOnInit(): void {
    this.apiLoaded = this.dataService.mapInitialized$;
    const api = this.service.getFarmerPlots(this.farmerData.id).subscribe({
      next: (res: IReference) => {
        const { loading, results } = res;
        this.farmList = [];
        this.loading = loading;
        if (!loading) {
          this.plotArray = results.map((item: any) => {
            const { name, province, country, location_type } = item;
            const nameDesc = PLOT_TYPES.find(a => a.id === location_type).name;
            let desc = '';
            if (province && country) {
              desc = `${province}, ${country}`;
            } else {
              desc = nameDesc;
            }
            this.farmList.push({
              title: name,
              description: desc,
              rightIcon: {
                isMatIcon: true,
                icon: 'keyboard_arrow_right',
              },
            });
            return {
              ...item,
              address: desc,
            };
          });
          this.plotSelected({ index: 0, item: this.farmList[0] });
        }
      },
    });
    this.pageApis.push(api);
  }

  plotSelected({ index }: IListWithIndex): void {
    this.geoJsonType = '';
    this.activeId = index;
    this.activePlotDetails = this.plotArray[index];

    if (this.activePlotDetails) {
      const { latitude, longitude, location_type, geo_json } =
        this.activePlotDetails;

      const geoJson = JSON.parse(geo_json);

      this.activePlotDetails.plotType = this.plotTypes.find(
        a => a.id === location_type
      ).name;
      this.markerPositions = [];
      if (
        [this.plotTypes[0].id, this.plotTypes[1].id].includes(location_type)
      ) {
        this.markerPositions.push({
          lat: latitude,
          lng: longitude,
        });
        this.center = {
          lat: latitude,
          lng: longitude,
        };
        this.zoom = 10;
      } else if (geoJson?.geometry?.type == 'Point') {
        this.geoJsonType = 'Point';
        this.markerPositions.push({
          lat: geoJson?.geometry?.coordinates[0],
          lng: geoJson?.geometry?.coordinates[1],
        });
        this.center = {
          lat: geoJson?.geometry?.coordinates[0],
          lng: geoJson?.geometry?.coordinates[1],
        };
        this.zoom = 10;
      } else {
        this.drawPolygon(geo_json);
      }
    }
  }

  drawPolygon(geo_json: string): void {
    const geoJson = JSON.parse(geo_json);
    const bounds = new google.maps.LatLngBounds();
    // geojson format
    const actualCoordinates = geoJson.geometry.coordinates[0];
    actualCoordinates.forEach((element: any[]) => {
      const [lng, lat] = element;
      this.markerPositions.push({
        lat,
        lng,
      });
      bounds.extend({
        lat,
        lng,
      });
    });
    this.center = {
      lat: bounds.getCenter().lat(),
      lng: bounds.getCenter().lng(),
    };
    this.zoom = 15;
  }

  mapReady(map: google.maps.Map): void {
    this.map = map;
  }

  ngOnDestroy(): void {
    this.pageApis.forEach(m => m.unsubscribe());
  }
}
