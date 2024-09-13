import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader'; // Usa el Loader de Google Maps

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer: ElementRef;
  map: google.maps.Map;

  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();

  private loader = new Loader({
    apiKey: 'TU_API_KEY', // Reemplaza con tu API key
    version: 'weekly',
  });

  ngOnInit() {
    this.loader.load().then(() => {
      this.loadMap();
    }).catch(error => {
      console.error('Error loading Google Maps:', error);
    });
  }

  loadMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: -33.4489, lng: -70.6693 }, // Coordenadas iniciales, Santiago, Chile
      zoom: 14,
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    // Listener para el clic en el mapa
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const clickedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.locationSelected.emit(clickedLocation);
      this.addMarker(clickedLocation);
    });
  }

  addMarker(location: { lat: number, lng: number }) {
    new google.maps.Marker({
      position: location,
      map: this.map,
    });
  }
}
