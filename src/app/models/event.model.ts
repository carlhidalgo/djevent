export interface Event {
    id: string,
    name: string,
    creatorId: string,
    Image: string,
    description: string,
    date: Date,
    location: {
        lng: number,
        lat: number,
    },
    applicants: string[],
    confirmed: string[],
    
}
 