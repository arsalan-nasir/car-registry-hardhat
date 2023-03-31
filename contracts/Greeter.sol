// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract CarRegistry {
    struct Car {
        address owner;
        string number;
        string model;
        string manufacturer;
    }

    mapping(string => Car) public Cars;

    modifier isOwner(address newOwner, string memory number) {
      require(msg.sender == Cars[number].owner, "Only Owner can transfer");
      _;
    }

    function setCar(string memory number, string memory model, string memory manufacturer) public {
        Car memory car = Car(msg.sender, number, model, manufacturer);
        Cars[car.number] = car;
    }

    function transferCarOwner(address newOwner, string memory number) public payable isOwner(newOwner, number){
        Cars[number].owner = newOwner;
    }

    function getCarOwner(string memory number) public view returns (address) {
        return Cars[number].owner;
    }

    function getCar(string memory number) public view returns (Car memory) {
        return Cars[number];
    }
}