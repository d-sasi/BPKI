// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Certificate {
        string publicKeyHash;
        string certificateHash;
        bool timeLimitExceeded;
        bool isRevoked;
        uint256 timestamp;
    }
    
    mapping (string => Certificate) private certificates;

    event response(string message, bool status);

    function registerCertificate(string memory publicKeyHash, string memory certificateHash) public payable{
        uint cnt = 0;
        if(certificates[publicKeyHash].timestamp != 0) {
            emit response("Certificate already exists", false);
            cnt += 1;
        }

        if(certificates[publicKeyHash].isRevoked) {
            emit response("Certificate has been revoked", false);
            cnt += 1;
        }

        if(cnt == 0) {
            certificates[publicKeyHash] = Certificate(publicKeyHash, certificateHash, false, false, block.timestamp);

            emit response("Certificate has been created successfully", true);
        }
    }


    function renewCertificate(string memory publicKeyHash, string memory newCertificateHash) public payable{
        uint256 cnt = 0;
        if(certificates[publicKeyHash].timestamp == 0) {
            emit response("Certificate does not exist", false);
            cnt += 1;
        }
        
        if(certificates[publicKeyHash].isRevoked) {
            emit response("Certificate has been revoked", false);
            cnt += 1;
        }

        Certificate storage cert = certificates[publicKeyHash];
        // uint256 timeElapsed = block.timestamp - cert.timestamp;

        // if(cnt == 0 && (cert.timeLimitExceeded || timeElapsed <= 365 days)) {
        //     cnt += 1;
        //     emit response("Certificate still valid", false);
        // }

        if(cnt == 0) {
            cert.certificateHash = newCertificateHash;
            cert.timestamp = block.timestamp;
            cert.timeLimitExceeded = false;

            emit response("Certificate renewed successfully!", true);
        }
    }

    function revokeCertificate(string memory publicKeyHash) public payable{
        uint256 cnt = 0;
        if(certificates[publicKeyHash].timestamp == 0) {
            emit response("Certificate does not exist", false);
            cnt += 1;
        }
        
        if(certificates[publicKeyHash].isRevoked) {
            emit response("Certificate has been revoked already!", false);
            cnt += 1;
        }

        if(cnt == 0) {
            certificates[publicKeyHash].isRevoked = true;
            
            emit response("Certificate has been revoked successfully!", true);
        }
    }
}