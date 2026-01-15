import { Account, Client, Databases, ID, Query, TablesDB, } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

const client = new Client()
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
    .setEndpoint("https://fra.cloud.appwrite.io/v1");


const database = new Databases(client);
const tablesDB = new TablesDB(client);

export const account = new Account(client);
console.log("Appwrite client initialized");

export const updateSearchCount = async (query: string, movie: Movie) => {
    console.log("Updating search count for query:");

    console.log("DATABASE_ID:", DATABASE_ID);
try {   
    const result = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: "metrics",
        queries: [Query.equal("searchTerm", query)],
    });
    if (result.rows.length > 0) {
        const existingMovie = result.rows[0];
        await tablesDB.updateRow({
            databaseId: DATABASE_ID,
            tableId: "metrics",
            rowId: existingMovie.$id,
            data: {
                count: existingMovie.count + 1,
            },
        });
    }
    else{
        await tablesDB.createRow({
            databaseId: DATABASE_ID,
            tableId: "metrics",
            rowId: ID.unique(),
            data: {
                searchTerm: query,
                movie_id: movie.id,
                count: 1,
                title: movie.title,
                poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            },
        });
    }
 } catch (error) {
        console.error("Error updating search count:", error);
        throw error;
    }

    // console.log("rows found:", result);
    // return result;

    //  check if a record of that search has been stored
    // if a document is found, incement the search,
    // if no document is found  , create a new document with search count 1
}

export const getTrendingMovies = async(): Promise<TrendingMovie[] | undefined>=>{
    try {
        const result = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: "metrics",
        queries: [Query.limit(5), Query.orderDesc("count")],
    });
    return result.rows as unknown as TrendingMovie[];
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return undefined
    }
}