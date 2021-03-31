pragma solidity ^0.5.0;

contract DStorage {
  string public name = "DStorage";
  //+-Number of files:_
  uint public fileCount = 0;
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

  //+-FileUpload Event:_
  event FileUploaded(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName,
    string fileDescription,
    uint uploadTime,
    address payable uploader
  );

  constructor() public {
  }

  //+-Upload File function:_
  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription) public {
    //+-Make sure the file hash exists:_
    require(bytes(_fileHash).length > 0);
    //+-Make sure file type exists:_
    require(bytes(_fileType).length > 0);
    //+-Make sure file description exists:_
    require(bytes(_fileDescription).length > 0);
    //+-Make sure file fileName exists:_
    require(bytes(_fileName).length > 0);
    //+-Make sure uploader address exists:_
    require(msg.sender!=address(0));
    //+-Make sure file size is more than 0:_
    require(_fileSize>0);

    //+-Increment file id:_
    fileCount ++;

    files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);

    //+-Trigger an Add File to the Contract Event:_
    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);
  }
}