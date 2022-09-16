import fs from "fs";
import dotenv from "dotenv";
import NFT from "../nft.json";
dotenv.config();

const ROOTDIR = process.cwd() + '/';
const DIR = ROOTDIR + 'metadata/';
const IMAGEHOST = 'ipfs://' + process.env.IPFS_NFT_KEY + '/';
for (var i in NFT) {
	let item = NFT[i];
	let path = DIR + i + '.json';

	// image
	item.image = IMAGEHOST + i + '.png';

	!('attributes' in item) && (item.attributes = []);

	// remove ipfs metadatalink from json
	if ('metadata' in item)
		delete item.metadata;

	fs.writeFileSync(path, JSON.stringify(item), 'utf8');
}