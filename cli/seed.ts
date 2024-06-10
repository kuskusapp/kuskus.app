// currently running commands inside assumes that user is already created through edgedb auth
// TODO: create it from seed.ts too

import { client } from "@/edgedb"
import {
	createGlobalState,
	createPlace,
	createPost,
} from "@/edgedb/crud/mutations"
import * as fs from "fs"
import * as path from "path"
import { create, get } from "ronin"
import e from "../dbschema/edgeql-js"

const userId = process.env.USER_ID!

async function seed() {
	// checkThatNotRunningInProduction()
	const args = Bun.argv
	const command = args[2]
	try {
		switch (command) {
			// TODO: create user here
			// case "base":
			// 	await base()
			// 	break
			case "web":
				await web()
				break
			case "homePublic":
				await homePublic()
				break
			case "profile":
				await profile()
				break
			case "place":
				await place()
				break
			case "posts":
				await posts()
				break
			case "places":
				await places()
				break
			case "clearPosts":
				await clearPosts()
				break
			case "test":
				await test()
				break
			case undefined:
				console.log("No command provided")
				break
			default:
				console.log("Unknown command")
				break
		}
		console.log("done")
	} catch (err) {
		console.error("Error:", err)
	}
}

// /{name}
async function profile() {
	await e
		.update(e.User, () => ({
			filter_single: { id: userId },
			set: {
				name: "nikiv",
				displayName: "Nikita",
				place: "Tbilisi, Georgia",
				bio: "Make kuskus.app",
				profilePhotoUrl: "https://images.kuskus.app/nikiv-profile-image",
				githubAvatarUrl: "https://avatars.githubusercontent.com/u/6391776",
			},
		}))
		.run(client)
}

async function homePublic() {
	await createGlobalState.run(client, {
		popularDishes: [
			"Coffee",
			"Smoothie",
			"Pasta",
			"Ramen",
			"Tacos",
			"Steak",
			"Curry",
			"Pizza",
			"Sushi",
			"Burger",
			"Salad",
		],
	})
}

async function place() {
	await e
		.insert(e.Place, {
			name: "pulp",
			displayName: "Pulp",
			bio: "Cafe in Tbilisi, Georgia",
			category: "cafe",
			profileImageUrl: "https://images.kuskus.app/nikiv-profile-image",
		})
		.run(client)
}

// adds some image posts to user
async function posts() {
	const images = readJPGFilesFromFolder("seed/foods")
	for (const image of images) {
		const roninPost = await get.post.with.fileNameFromImport(image.fileName)
		let imageDescription = await describeImage(
			image.buffer,
			process.env.HUGGINGFACE_TOKEN,
		)

		if (roninPost) {
			const dbPost = await e
				.insert(e.Post, {
					imageUrl: roninPost.photo.src,
					roninId: roninPost.id,
					imageWidth:
						"width" in roninPost.photo.meta ? roninPost.photo.meta.width : 0,
					imageHeight:
						"height" in roninPost.photo.meta ? roninPost.photo.meta.height : 0,
					imagePreviewBase64Hash: roninPost.photo.placeholder.base64,
					aiDescription: imageDescription,
					imageFileNameFromImport: image.fileName,
					created_by: e.cast(e.User, e.uuid(userId)),
				})
				.run(client)
			console.log(dbPost, "db post added from existing ronin post")
		} else {
			const res = await create.post.with({
				photo: image.buffer,
				fileNameFromImport: image.fileName,
				aiDescription: imageDescription,
			})
			console.log(res, "ronin post added")
			const dbPost = await createPost.run(client, {
				imageUrl: res.photo.src,
				roninId: res.id,
				imageWidth:
					"width" in roninPost.photo.meta ? roninPost.photo.meta.width : 0,
				imageHeight:
					"height" in roninPost.photo.meta ? roninPost.photo.meta.height : 0,
				imagePreviewBase64Hash: res.photo.placeholder.base64,
				aiDescription: imageDescription,
				imageFileNameFromImport: image.fileName,
				userId: userId,
			})
			console.log(dbPost, "db post added with ronin post")
		}
	}
}

export async function describeImage(imageBlob: any, huggingFaceToken: string) {
	try {
		const response = await fetch(
			// "https://api-inference.huggingface.co/models/unum-cloud/uform-gen",
			"https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning",
			{
				headers: {
					// Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
					Authorization: `Bearer ${huggingFaceToken}`,
				},
				method: "POST",
				body: imageBlob,
			},
		)

		if (!response.ok) {
			console.error("Failed to fetch:", response.status, response.statusText)
			return "Error fetching image description"
		}

		const result = await response.json()
		if (!result || result.length === 0 || !result[0].generated_text) {
			console.error("Unexpected response format:", result)
			return "Unexpected response format"
		}

		return result[0].generated_text
	} catch (error) {
		console.error("Error in describeImage:", error)
		return "Error processing image description"
	}
}

async function places() {
	await createPlace.run(client, {
		name: "n31-restaurant-bar",
		displayName: "N31 Restaurant & Bar",
		location: "Warsaw",
		profileImageUrl:
			"https://lh3.googleusercontent.com/p/AF1QipNLXMcjYJ6aVYaB45Ma-Om8TCGu2F5AEyIAPVJj=s1360-w1360-h1020",
		bio: "Airy, contemporary restaurant offering artful & elevated Polish cuisine alongside wine & cocktails",
		category: "bar",
		googleMapsUrl: "https://maps.app.goo.gl/PtKt1CmLL7kFrMD9A",
	})
	await createPlace.run(client, {
		name: "pracownia-sushi",
		displayName: "Pracownia Sushi",
		location: "Warsaw",
		profileImageUrl:
			"https://lh3.googleusercontent.com/p/AF1QipNw6rLevZ_HKlhlSlwKG626wO8bFCfip4dz43w9=s1360-w1360-h1020",
		bio: "Slick restaurant offering generous sushi dishes & creative rolls in a wood-&-glass dining area.",
		category: "sushi",
		googleMapsUrl: "https://maps.app.goo.gl/DcuRTXg2vbzeyk7q8",
	})
	await createPlace.run(client, {
		name: "sklep-z-kawa-i-kawiarnia",
		displayName: "Sklep z Kawą i Kawiarnia",
		location: "Warsaw",
		profileImageUrl:
			"https://lh5.googleusercontent.com/p/AF1QipPB8FL_x-CQbk9z4ZYLkaqyrHNfkhnFhJ5-T0Qw=w408-h271-k-no",
		category: "coffee",
		googleMapsUrl: "https://maps.app.goo.gl/MUgqq1GWmR7oG9m98",
	})
	await createPlace.run(client, {
		name: "wazaap",
		displayName: "Wazaap",
		location: "Warsaw",
		profileImageUrl:
			"https://lh5.googleusercontent.com/p/AF1QipPBtbz87EZ9HGIia9bkRT2szr99d5Bg9PRvLKvc=w408-h306-k-no",
		category: "coffee",
		googleMapsUrl: "https://maps.app.goo.gl/X1ow4cpGAeCAqr5z9",
	})
	await createPlace.run(client, {
		name: "starbucks",
		displayName: "Starbucks",
		location: "Warsaw",
		profileImageUrl:
			"https://lh5.googleusercontent.com/p/AF1QipMs99XwZW19PZEqHjkFfkkGRIxGfbJcvcHQOLPM=w408-h306-k-no",
		category: "coffee",
		googleMapsUrl: "https://maps.app.goo.gl/amiYmz6vLiJ3FAL46",
	})
}

async function web() {
	// await createPost(
	//   {
	//     photoUrl: "https://avatars.githubusercontent.com/u/6391776?v=4",
	//     description: "profile image",
	//   },
	//   "d6baa570-049a-11ef-b969-074fde013f53",
	// )
}

async function clearPosts() {
	const posts = await getPostsByUser(userId)
	console.log(posts)
	// posts.map(async (post) => {
	//   await drop.post.with.id(post.photoId)
	// })
	// await e.delete(e.Post).run(client)
}

function checkThatNotRunningInProduction() {
	if (process.env.EDGEDB_INSTANCE === "nikitavoloboev/kuskus") {
		throw new Error(
			"Connected to production DB, don't run these seed commands on it",
		)
	}
}

async function getPostsByUser(userId: string) {
	const posts = await e
		.select(e.Post, (post) => ({
			photoUrl: true,
			roninId: true,
			filter: e.op(post.created_by.id, "=", e.uuid(userId)),
		}))
		.run(client)
	return posts
}

// TODO: move functions to ts-utils & import them
function getFileRelativeToCurrentFolder(relativePath: string) {
	return Bun.file(path.join(import.meta.dirname, relativePath))
}
function getFileRelativeToCurrentFolderAsNodeBuffer(relativePath: string) {
	return fs.readFileSync(path.join(import.meta.dirname, relativePath))
}
function readJPGFilesFromFolder(
	folderPath: string,
): { fileName: string; buffer: Buffer }[] {
	const directoryPath = path.join(import.meta.dirname, folderPath)
	const files = fs.readdirSync(directoryPath)
	const jpgFiles = files
		.filter((file) => file.endsWith(".jpg"))
		.map((jpgFile) => ({
			fileName: jpgFile,
			buffer: getFileRelativeToCurrentFolderAsNodeBuffer(
				path.join(folderPath, jpgFile),
			),
		}))
	return jpgFiles
}

async function test() {
	const images = readJPGFilesFromFolder("seed/foods")
	const rightImage = images[4]
	console.log(rightImage.fileName)
	console.log(rightImage.buffer)
	// for (const image of images) {
	// 	let imageDescription = await describeImage(
	// 		image.buffer,
	// 		process.env.HUGGINGFACE_TOKEN,
	// 	)
	// 	console.log(imageDescription)
	// }
}

await seed()
