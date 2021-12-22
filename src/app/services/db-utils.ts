
//separate database layer from application layer
export function convertSnaps<T>(resultsCollection): T[] {
    return <T[]> resultsCollection.docs.map(snapshot => {
        //calling map on the docs array lets us parse the 
        //snapshot data and return it as the object type T
        return {
            id: snapshot.id,
            //spread operator can't be applied to unknown,
            //cast snapshotdata to any to apply spread operator
            ...<any>snapshot.data()
        }
    })
}