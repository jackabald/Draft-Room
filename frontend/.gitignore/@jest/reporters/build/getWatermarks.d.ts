/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import istanbulReport = require('istanbul-lib-report');
import type { Config } from '@jest/types';
export default function getWatermarks(config: Config.GlobalConfig): istanbulReport.Watermarks;
