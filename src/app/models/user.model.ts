export interface User {
    image: string; // Cambiado a string para almacenar la URL de la imagen
    uid: string;
    email: string;
    displayName: string;
    password: string;
    name: string;
    nickname: string; // Nuevo campo de apodo
    role: string;  // Nuevo campo de rol
    ratings: number []; // Nuevo campo de rating
    rating: number; // Cambiado a number para almacenar la calificación
    termsConditions: boolean;  // Nuevo campo para aceptar términos y condiciones
}