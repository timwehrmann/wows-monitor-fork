import { Component, OnDestroy, OnInit } from '@angular/core';
import { j2xParser, parse as parseXml2Json } from 'fast-xml-parser';
import { join as pathJoin } from 'path';
import { ConfigtoolConfig } from 'src/app/interfaces/configtool-config.interface';
import { ElectronService } from 'src/app/services/desktop/electron.service';
import { Config } from 'src/config/config';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-configtool',
  templateUrl: './configtool.component.html'
})
export class ConfigtoolComponent extends BaseComponent implements OnInit, OnDestroy {

  lines: ConsoleLine[] = [];

  constructor(
    private electronService: ElectronService,
    public config: Config) {
    super();
  }

  ngOnInit() {
  }

  start() {
    const combinedPaths = [...this.config.configtoolConfig.clientPaths];
    combinedPaths.unshift(this.config.selectedDirectory);

    for (const path of combinedPaths) {
      this.res(path, this.config.configtoolConfig);
      this.resMods(path, this.config.configtoolConfig);
    }
  }

  removePath(i: number) {
    this.config.configtoolConfig.clientPaths.splice(i, 1);
  }

  async selectPath(i: number) {
    var path = this.config.configtoolConfig.clientPaths[i];
    var odr = await this.electronService.dialog.showOpenDialog(this.electronService.remote.BrowserWindow.getFocusedWindow(), {
      defaultPath: path != '' ? path : undefined,
      properties: ['openDirectory']
    });
    if (odr && odr.filePaths && odr.filePaths.length > 0) {
      this.ngZone.run(() => this.config.configtoolConfig.clientPaths[i] = odr.filePaths[0]);
    }
  }

  private res(gamePath: string, config: ConfigtoolConfig) {
    const resPath = pathJoin(gamePath, 'res', 'engine_config.xml');
    this.setValues(resPath, config);
  }

  private resMods(gamePath: string, config: ConfigtoolConfig) {
    const resModsPath = pathJoin(gamePath, 'res_mods');
    this.electronService.fs.readdirSync(resModsPath).forEach(folder => {
      const path = pathJoin(resModsPath, folder, 'engine_config.xml');
      this.setValues(path, config);
    });
  }

  private setValues(path: string, config: ConfigtoolConfig) {
    if (!this.electronService.fs.existsSync(path)) {
      this.writeWarn(`Couldn't find config in ${path}`);
      return;
    }
    try {
      const fileContents = this.electronService.fs.readFileSync(path, { encoding: 'utf8' });
      this.electronService.fs.writeFileSync(path.replace('engine_config.xml', 'engine_config_backup.xml'), fileContents);

      this.writeInfo(`Config backup ${path.replace('engine_config.xml', 'engine_config_backup.xml')} saved`);

      const json = parseXml2Json(fileContents);

      json['engine_config.xml'].renderer.maxFrameRate = config.maxFrameRate;
      if (config.cacheEffectsEnabled) {
        json['engine_config.xml'].renderer.cacheEffects = config.cacheEffects;
      }
      if (config.streamCacheSizeKBEnabled) {
        json['engine_config.xml'].animation.streamCacheSizeKB = config.streamCacheSizeKB;
      }
      if (config.maxReplaysToSaveEnabled) {
        json['engine_config.xml'].replays.maxReplaysToSave = config.maxReplaysToSave;
      }
      this.electronService.fs.writeFileSync(path, new j2xParser({ indentBy: '  ', format: true }).parse(json));
      this.writeInfo(`Config ${path} saved.`);
    } catch (err) {
      this.writeError(`Couldn't read/write file ${path}`);
      this.writeError(err.replace('TypeError: ', '').replace(' of undefined', ''));
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  private writeInfo(msg: string) {
    this.lines.push({ severity: 'info', text: msg });
  }

  private writeError(msg: string) {
    this.lines.push({ severity: 'error', text: msg });
  }

  private writeWarn(msg: string) {
    this.lines.push({ severity: 'warn', text: msg });
  }
}

export interface ConsoleLine {
  severity: 'info' | 'error' | 'warn';
  text: string;
}