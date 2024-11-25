export interface AppEvent  {
    target: HTMLTextAreaElement;
    id: string,
    name: string,
    creatorId: string,
    Image: string,
    description: string,
    date: string,
    location: {
        lng: number,
        lat: number,
    },
    applicants: { userId: string, userEmail: string, userImage: string, userName: string, userRating: number }[]; // Asumiendo que applicants es un array de objetos con userId y otros detalles
    acepted: string[],
    confirmed: string[],
    
}
 