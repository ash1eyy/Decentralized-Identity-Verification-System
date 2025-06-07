const contractAddress = "0x0Cb6864EE31f0fA0642dB7aeBa38ADA5D5a06ac0";
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "IdentityRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "verified",
				"type": "bool"
			}
		],
		"name": "IdentityVerified",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_dob",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_idNumber",
				"type": "string"
			}
		],
		"name": "registerIdentity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "_status",
				"type": "bool"
			}
		],
		"name": "verifyIdentity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			}
		],
		"name": "getIdentity",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "identities",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "dob",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "idNumber",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "walletAddress",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "verified",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			}
		],
		"name": "identityExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_idNumber",
				"type": "string"
			}
		],
		"name": "isIdNumberUsed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let provider, signer, contract;
let currentAccount;
let isAdmin = false;

// Buttons
const connectWalletBtn = document.getElementById('connect-wallet');
const registerIdentityBtn = document.getElementById('register-identity');
const checkIdentityBtn = document.getElementById('check-identity');
const verifyIdentityBtn = document.getElementById('verify-identity');
const revokeIdentityBtn = document.getElementById('revoke-identity');

// Sections/text boxes
const walletAddress = document.getElementById('wallet-address');
const adminStatus = document.getElementById('admin-status');
const identitySection = document.getElementById('identity-section');
const adminSection = document.getElementById('admin-section');

connectWalletBtn.addEventListener('click', async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            const address = await signer.getAddress();
            
            // FIX: Set the global currentAccount variable
            currentAccount = address;
            
            walletAddress.textContent = `Connected: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
            walletAddress.className = 'connected';
            console.log("Wallet connected");

             // Initialize contract
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            console.log("Contract instance: ", contract);

            // Verify provider and signer
            console.log("Provider:", provider);
            console.log("Signer address:", await signer.getAddress());
            
            checkAdminStatus(address);
            updateUI();
        } catch (error) {
            console.error("Error connecting wallet:", error);
            // FIX: Use walletAddress instead of walletStatus
            walletAddress.textContent = "Error connecting wallet";
        }
    }
    else {
        // FIX: Use walletAddress instead of walletStatus
        walletAddress.textContent = "Please install MetaMask!";
    }
});


// Initialize the application
// async function init() {
//     // Check if MetaMask is installed
//     if (window.ethereum) {
//         provider = new ethers.providers.Web3Provider(window.ethereum);
//         try {
//             // Request account access
//             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//             currentAccount = accounts[0];
//             updateUI();
            
//             // Listen for account changes
//             window.ethereum.on('accountsChanged', (accounts) => {
//                 currentAccount = accounts[0];
//                 updateUI();
//             });
            
//             // Initialize contract
//             signer = provider.getSigner();
//             contract = new ethers.Contract(contractAddress, contractABI, signer);
            
//             // Check if current user is admin
//             checkAdminStatus();
            
//         } catch (error) {
//             console.error("User denied account access", error);
//         }
//     } else {
//         alert("Please install MetaMask to use this application!");
//     }
// }

// Update UI based on current state
async function updateUI() {
    console.log("Updating UI");
    identitySection.style.display = 'block';
    
    
}

// Check if current user is admin
async function checkAdminStatus(address) {
    console.log("Attempting to get admin");
    adminAddress = await contract.admin();
    console.log("Admin address retrieved:", adminAddress);
    isAdmin = (address.toLowerCase() === adminAddress.toLowerCase());

    if (isAdmin) {
        console.log("Admin");
        adminStatus.textContent = "You are an admin";
        adminSection.style.display = 'block';
    }
    else {
        console.log("Not admin");
        adminStatus.textContent = "";
        adminSection.style.display = 'none';
    }
}

registerIdentityBtn.addEventListener('click', async() => {
    const name = document.getElementById('name').value;
    const dobInput = document.getElementById('dob').value;
    const idNumber = document.getElementById('id-number').value;
    
    if (!name || !dobInput || !idNumber) {
        alert("Please fill in all fields");
        return;
    }
    
    // Convert date to timestamp
    const dob = Math.floor(new Date(dobInput).getTime() / 1000);
    
    try {
        const tx = await contract.registerIdentity(name, dob, idNumber);
        await tx.wait();
        alert("Identity registered successfully!");
        await checkIdentity();
    } catch (error) {
        console.error("Error registering identity:", error);
        alert("Error registering identity: " + error.message);
    }
});

checkIdentityBtn.addEventListener('click', async() => {
    checkIdentity();
});

// Also fix the checkIdentity function to add better error handling
async function checkIdentity() {
    console.log("Checking identity");
    
    // FIX: Add validation for currentAccount
    if (!currentAccount) {
        console.error("No wallet connected");
        alert("Please connect your wallet first");
        return;
    }
    
    try {
        console.log("Fetching identity for:", currentAccount);
        const identity = await contract.getIdentity(currentAccount);
        console.log("Identity obtained: ", identity);
        const identityInfo = document.getElementById('identity-info');
        
        console.log(identity[0]);
        if (identity[0] === "") {
            identityInfo.innerHTML = "<p>No identity registered for this address.</p>";
            document.getElementById('register-form').style.display = 'block';
            document.getElementById('view-identity').style.display = 'none';
        } else {
            const dobDate = new Date(identity[1] * 1000);
            const formattedDob = dobDate.toLocaleDateString();
            
            identityInfo.innerHTML = `
                <p><strong>Name:</strong> ${identity[0]}</p>
                <p><strong>Date of Birth:</strong> ${formattedDob}</p>
                <p><strong>ID Number:</strong> ${identity[2]}</p>
                <p><strong>Verified:</strong> ${identity[3] ? '✅ Verified' : '❌ Not Verified'}</p>
            `;
            
            document.getElementById('register-form').style.display = 'none';
            document.getElementById('view-identity').style.display = 'block';
        }
    } catch (error) {
        console.error("Error checking identity:", error);
        alert("Error checking identity: " + error.message);
    }
}

verifyIdentityBtn.addEventListener('click', async() => {
    verifyIdentity(true);
});

revokeIdentityBtn.addEventListener('click', async() => {
    verifyIdentity(false);
});

// Verify or revoke identity (admin function)
async function verifyIdentity(status) {
    const userAddress = document.getElementById('user-address').value;
    
    if (!ethers.utils.isAddress(userAddress)) {
        alert("Please enter a valid Ethereum address");
        return;
    }
    
    try {
        const tx = await contract.verifyIdentity(userAddress, status);
        await tx.wait();
        alert(`Identity ${status ? 'verified' : 'verification revoked'} successfully!`);
    } catch (error) {
        console.error("Error verifying identity:", error);
        alert("Error verifying identity: " + error.message);
    }
}

// Initialize the app when the page loads
// window.addEventListener('DOMContentLoaded', init);
