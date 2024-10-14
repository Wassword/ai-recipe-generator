import { defineBackend } from "@aws-amplify/backend";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { data } from "./data/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { auth } from "./auth/resource";

const backend = defineBackend({
  auth,
  data,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
    "bedrockDS",
    "https://bedrock-runtime.us-east-1.amazonaws.com",
    {
      authorizationConfig: {
        signingRegion: "us-east-1",
        signingServiceName: "bedrock",
      },
    }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
    new PolicyStatement({
      resources: [
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
      ],
      actions: ["bedrock:InvokeModel"],

    })
);