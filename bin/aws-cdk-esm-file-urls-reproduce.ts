#!/usr/bin/env node
import { App } from 'aws-cdk-lib'
import { ExampleStack } from '../lib/stack.js'
const app = new App()

new ExampleStack(app, 'ExampleStack', {
  env: {
    'region': 'eu-west-1',
  },
})
