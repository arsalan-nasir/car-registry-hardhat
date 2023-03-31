const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test CarManagement", () => {
  it("should insert car details with owner assigning", async () => {
    const [owner] = await ethers.getSigners();
    const CarRegistry = await ethers.getContractFactory("CarRegistry");
    const carRegistry = await CarRegistry.deploy();

    const newCarDetails = {
      number: "TEST-333",
      manufacturer: "Toyota",
      model: "2019",
    };

    await carRegistry.setCar(
      newCarDetails.number,
      newCarDetails.model,
      newCarDetails.manufacturer
    );

    const carOwner = await carRegistry.getCarOwner(newCarDetails.number);

    expect(owner.address).to.be.equals(carOwner);
  });

  it("should return correct car details", async () => {
    const [owner] = await ethers.getSigners();
    const CarRegistry = await ethers.getContractFactory("CarRegistry");
    const carRegistry = await CarRegistry.deploy();

    const newCarDetails = {
      number: "ABC-123",
      manufacturer: "Suzuki",
      model: "2023",
    };

    await carRegistry.setCar(
      newCarDetails.number,
      newCarDetails.model,
      newCarDetails.manufacturer
    );

    const carDetails = await carRegistry.getCar(newCarDetails.number);

    expect(carDetails.number).to.be.equals(newCarDetails.number);
    expect(carDetails.manufacturer).to.be.equals(newCarDetails.manufacturer);
    expect(carDetails.model).to.be.equals(newCarDetails.model);
  });

  it("should transfer car ownership", async () => {
    const [owner] = await ethers.getSigners();
    const buyer = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const CarRegistry = await ethers.getContractFactory("CarRegistry");
    const carRegistry = await CarRegistry.deploy();

    const newCarDetails = {
      number: "ABC-123",
      manufacturer: "Suzuki",
      model: "2023",
    };

    await carRegistry.setCar(
      newCarDetails.number,
      newCarDetails.model,
      newCarDetails.manufacturer
    );

    let currentCarOwner = await carRegistry.getCarOwner(newCarDetails.number);

    expect(currentCarOwner).to.be.equals(owner.address);

    await carRegistry.transferCarOwner(buyer, newCarDetails.number);

    currentCarOwner = await carRegistry.getCarOwner(newCarDetails.number);

    expect(currentCarOwner).to.be.equals(buyer);
  });
});
