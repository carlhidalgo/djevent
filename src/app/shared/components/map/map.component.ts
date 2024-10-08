import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader'; // Usa el Loader de Google Maps

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer: ElementRef;
    

  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();


  map: google.maps.Map;
  marker: google.maps.marker.AdvancedMarkerElement | null = null;



  private loader = new Loader({
    apiKey: 'AIzaSyAfs4yQ4H89F6DyfFY8_1BqeZkSx9ght_0', 
    version: 'weekly',
    libraries: ['marker'] // Asegúrate de incluir la biblioteca de marcadores
  });

  ngOnInit() {
    this.loader.load().then(() => {
      this.initMap();
    });
  }

  initMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: -33.4489, lng: -70.6693 }, // Coordenadas iniciales, Santiago, Chile
      zoom: 12,
      mapId: '6fd742fb8cb5c649 ' // Id del estilo de mapa
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      this.onMapClick(event);
    });
  }
  
  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      if (this.marker) {
        this.marker.position = event.latLng;
      } else {
        this.marker = new google.maps.marker.AdvancedMarkerElement({
          position: event.latLng,
          map: this.map,
        });
      }

      this.locationSelected.emit({ lat, lng });
    }
  }


}
