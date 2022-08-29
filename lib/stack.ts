import { Construct } from 'constructs'
import {
  Duration,
  Stack,
  StackProps,
  aws_logs as logs,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambdaNodejs,
} from 'aws-cdk-lib'
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'

export class ExampleStack extends Stack {
  readonly api: HttpApi

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)
    const stackBaseName = this.stackName.slice(0, -5)

    this.api = new HttpApi(this, stackBaseName + 'Api', {
    })

    const lambdaPolicy = new iam.PolicyStatement()

    function addFunctionRoute(
      scope: Construct,
      api: HttpApi,
      memorySize: number,
      methods: HttpMethod[],
      path: string,
      functionId: string, // Must match the stack.functionId.ts filename
      timeout: number,
    ) {
      const handler = new lambdaNodejs.NodejsFunction(scope, functionId, {
        runtime: lambda.Runtime.NODEJS_16_X,
        tracing: lambda.Tracing.ACTIVE,
        logRetention: logs.RetentionDays.ONE_MONTH,
        memorySize,
        timeout: Duration.seconds(timeout),
        initialPolicy: [lambdaPolicy],
      })
      api.addRoutes({
        path,
        methods,
        integration: new HttpLambdaIntegration(functionId + 'Integration', handler),
      })
    }

    const defaultLambdaTimeout = 28

    addFunctionRoute(
      this,
      this.api,
      512,
      [HttpMethod.GET],
      '/ping',
      'ping',
      defaultLambdaTimeout,
    )
  }
}
