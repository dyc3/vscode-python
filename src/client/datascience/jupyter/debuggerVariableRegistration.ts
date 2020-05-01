// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { inject, injectable, named } from 'inversify';
import { DebugAdapterTracker, DebugAdapterTrackerFactory, DebugSession, ProviderResult } from 'vscode';
import { IExtensionSingleActivationService } from '../../activation/types';
import { IDebugService } from '../../common/application/types';
import { IDisposableRegistry } from '../../common/types';
import { Identifiers } from '../constants';
import { IJupyterVariables } from '../types';

@injectable()
export class DebuggerVariableRegistration implements IExtensionSingleActivationService, DebugAdapterTrackerFactory {
    constructor(
        @inject(IDebugService) private debugService: IDebugService,
        @inject(IDisposableRegistry) private disposables: IDisposableRegistry,
        @inject(IJupyterVariables) @named(Identifiers.DEBUGGER_VARIABLES) private debugVariables: DebugAdapterTracker
    ) {}
    public activate(): Promise<void> {
        this.disposables.push(this.debugService.registerDebugAdapterTrackerFactory('python', this));
        return Promise.resolve();
    }

    public createDebugAdapterTracker(_session: DebugSession): ProviderResult<DebugAdapterTracker> {
        return this.debugVariables;
    }
}