pragma solidity ^0.5.0;

contract DStorage {
  string public name = "DStorage";
  //+-Number of files:_
  //+-Mapping fileId=>Struct:_
  mapping(uint => File) public files;

  //+-Struct:_
  struct File {
    uint fileId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    address payable uploader;
  }

  //+-Event:_

  constructor() public {
  }

  //+-Upload File function:_
  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription) public {

    files[1] = File(1, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);

    //+-Make sure the file hash exists:_

    //+-Make sure file type exists:_

    //+-Make sure file description exists:_

    //+-Make sure file fileName exists:_

    //+-Make sure uploader address exists:_

    //+-Make sure file size is more than 0:_


    //+-Increment file id:_

    //+-Add File to the contract:_

    //+-Trigger an event:_
  }
}