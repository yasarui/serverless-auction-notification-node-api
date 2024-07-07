const { SendEmailCommand, SESClient } = require("@aws-sdk/client-ses");

// Set the AWS Region.
const REGION = "us-east-1";

const sesClient = new SESClient({ region: REGION });

const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
      Destination: {
        ToAddresses: [
          toAddress,
        ],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: "Yasar You are amazing",
          },
          Text: {
            Charset: "UTF-8",
            Data: "Hello from Yasar Arafat",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Test Mail",
        },
      },
      Source: fromAddress,
    });
  };

async function hello(event, context) {

    const record = event.Records[0];

    console.log('Record processing', record);

    const email = JSON.parse(record.body);

    const { subject, body, recipient } = email;

    console.log({subject, body, recipient});

    const sendEmailCommand = createSendEmailCommand(
        "yasararafatui@gmail.com",
        "yasararafatui@gmail.com",
      );
      try {
        return await sesClient.send(sendEmailCommand);
      } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
          const messageRejectedError = caught;
          return messageRejectedError;
        }
        throw caught;
      }
}

exports.handler = hello;