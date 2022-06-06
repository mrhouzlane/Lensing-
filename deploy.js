// This is the deployment of script 
// Deployed to Solana -> we need keypair to pay for that 

import spawn from "cross-spawn";
import path from "path";

import { fileURLToPath } from "url"; 
import { dirname } from "path";
import { generateKeyPair } from "crypto";
import { KeyPair, Connection, LAMPORTS_PER_SOL} from "@solana/web3.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const programAuthorityKeyfileName = `deploy/programautority-keypair.json`; 

const programAuthorityKeyfileFile = path.resolve(`${__dirname}${SLASH}${programAuthorityKeyfileName}`)

const connection = new Connection("https://api.devnet.solana.com", "confirmed")
const projectName = 'russian'


(async()=> {

    let method 

    if (!fs.existsSync(programAuthorityKeypairFile)) {
        // create it 
        // use to deploy 

        spawn.sync("anchor", ["build"], {stdio: "inherit"})
        let programAuthorityKeypair = new KeyPair()
        let signature = await connection.requestAirdrop(programAuthorityKeypair.publicKey, LAMPORTS_PER_SOL * 5 )
        connection.confirmTransaction(signature)

        console.log(`\n\n\ Created keypair.\n`)
        console.log(`\n\n\ Saving keypair. ${programAuthorityKeyfileFile}\n`)

        //secret key pair -> buffering get bytes -> into JSON -> saved in fs 
        fs.writeFileSync(
            programAuthorityKeypairFile, `[${Buffer.from(programAuthorityKeyPair.secretKey.toString())}]`
        )

        method = ["deploy"]

    } else {
        // exists -> deploy 

        method = ["upgrade"]

    }

    spawn.sync("anchor", [...method, "--provider.cluster", "Devnet", "--provider.wallet", `${programAuthorityKeypairFile}`], {stdio: "inherit"})

    fs.copyFile(`target.idl/${projectName}.json`,
    `app/src/lib/idl/${projectName}.json`,
    (err) => {
        if (err) throw err
        console.log(`${projectName}.json was copied to ./app`)
    })
})