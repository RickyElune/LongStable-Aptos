/**
 * Copyright 2024 Circle Internet Group, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Account, AccountAddress } from "@aptos-labs/ts-sdk";
import { strict as assert } from "assert";
import sinon, { SinonStub } from "sinon";
import { changeAdmin } from "../../scripts/typescript/changeAdmin";
import * as aptosExtensionsPackageModule from "../../scripts/typescript/packages/aptosExtensionsPackage";
import { getAptosClient } from "../../scripts/typescript/utils";

describe("changeAdmin", () => {
  let aptosExtensionsPackageStub: SinonStub;

  beforeEach(() => {
    aptosExtensionsPackageStub = sinon.stub(
      aptosExtensionsPackageModule,
      "AptosExtensionsPackage"
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should call the changeAdmin function with correct inputs", async () => {
    const aptosExtensionsPackageId = AccountAddress.ZERO.toString();
    const stablecoinPackageId = AccountAddress.ONE.toString();
    const admin = Account.generate();
    const newAdmin = AccountAddress.THREE.toString();
    const rpcUrl = "http://localhost:8080";

    const changeAdminFn = sinon.fake();
    aptosExtensionsPackageStub.returns({
      manageable: {
        changeAdmin: changeAdminFn
      }
    });

    await changeAdmin({
      aptosExtensionsPackageId,
      stablecoinPackageId,
      adminKey: admin.privateKey.toString(),
      newAdmin,
      rpcUrl
    });

    // Ensure that the request will be made to the correct package.
    sinon.assert.calledWithNew(aptosExtensionsPackageStub);
    sinon.assert.calledWithExactly(
      aptosExtensionsPackageStub,
      getAptosClient(rpcUrl),
      aptosExtensionsPackageId
    );

    // Ensure that the request is correct.
    assert.strictEqual(
      changeAdminFn.calledOnceWithExactly(admin, stablecoinPackageId, newAdmin),
      true
    );
  });
});
