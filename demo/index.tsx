/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 14 Nov 2017
 * Description:
 */
import * as React from 'react';
import {render} from 'react-dom';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Radio from 'semantic-ui-react/dist/commonjs/addons/Radio';
import Select from 'semantic-ui-react/dist/commonjs/addons/Select';
import Table from 'semantic-ui-react/dist/commonjs/collections/Table';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Progress from 'semantic-ui-react/dist/commonjs/modules/Progress';

import ResourceManager, {IResourceEntry} from '../index';
import './base.scss';
import { MouseEvent } from 'react';

interface IPropTypes {

}
interface IStateTypes {
  timeout: number;
  resources: IResourceEntry[];
  message: string;
  percent: number;
}

class Demo extends React.Component<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    timeout: 0,
    resources: [
      {
        preload: true,
        name: 'H光大小姐',
        src: 'http://oekm6wrcq.bkt.clouddn.com/hh.png',
        type: 'image',
        weight: 1
      },
      {
        preload: true,
        name: '秦皇岛',
        src: 'http://oekm6wrcq.bkt.clouddn.com/秦皇岛.mp3',
        type: 'audio',
        weight: 1
      },
      {
        preload: true,
        name: 'bml2017',
        src: 'http://oekm6wrcq.bkt.clouddn.com/bml-h5.mp4',
        type: 'video',
        weight: 1
      }
    ],
    message: 'wait',
    percent: 0
  };
  private resourceManager: ResourceManager;

  constructor(props: IPropTypes) {
    super(props);
    this.resourceManager = new ResourceManager();
    this.resourceManager.registerOnProgress(this.handleProgress);
    this.resourceManager.registerOnError(this.handleError);
  }

  private handleAddResource = () => {
    const {
      resources
    } = this.state;

    resources.push({
      preload: false,
      name: '',
      src: '',
      type: 'image',
      weight: 0
    });

    this.setState({resources});
  }

  private handleChangeItem = (index: number, key: string, value: string | number | boolean) => {
    this.state.resources[index][key] = value;
    this.forceUpdate();
  }

  private handleDelete = (index: number) => {
    this.state.resources.splice(index, 1);
    this.forceUpdate();
  }

  private handleLoad = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.resourceManager.init(this.state.resources);
    this.resourceManager.load();
  }

  private handleProgress = (progress: number, current: string) => {
    this.setState({
      percent: progress * 100,
      message: `Loading...current: ${current}, progress: ${(progress * 100).toFixed(2)}%`
    });
  }

  private handleError = (error: Error, current: string) => {
    this.setState({message: `Error! ${current}.`})
  }

  public render() {
    return (
      <div className={'root'}>
        <div className={'topbar'}>
          <a
            href={'https://github.com/dtysky/ResourceManager'}
            target={'_blank'}
          >
            View on Github
          </a>
        </div>
        <div className={'body'}>
          <Card>
            <Card.Content>
              <Card.Header>
                Actions
              </Card.Header>
              <Card.Meta>
                "timeout" is a parameter for defining the max duration of preloading, set it to 0 to disable;
                if loading is overtime, resource-manager will stop this loading forcibly. <br />
                After adding resource, click "Load" button to preload them.
              </Card.Meta>
              <Card.Description>
                {this.renderActions()}
              </Card.Description>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content>
              <Card.Header>
                Resources
              </Card.Header>
              <Card.Meta>
                Add your own resources and configure them here. <br />
                "name" is the name of resource,
                "src" is its url,
                "type" is its file type,
                "preload" is a switch for preloading,
                "weight" is the weight of it when preloading.
              </Card.Meta>
              <Card.Description>
                <Button onClick={this.handleAddResource}>
                  Add resource
                </Button>
                {this.renderTable()}
              </Card.Description>
            </Card.Content>
          </Card>
        </div>
      </div>
    );
  }

  private renderActions() {
    const {
      timeout,
      message,
      percent
    } = this.state;

    return (
      <Form>
        <Form.Field>
          <Label pointing={'below'}>
            timeout
          </Label>
          <Input
            type={'number'}
            value={timeout}
            onChange={(e, data) => {
              this.setState({timeout: parseFloat(data.value)});
            }}
          />
        </Form.Field>
        <Form.Field>
          <Label pointing={'below'}>
            {message}
          </Label>
          <Progress
            percent={percent}
            color={'pink'}
          />
        </Form.Field>
        <Button onClick={this.handleLoad}>
          Load
        </Button>
      </Form>
    );
  }

  private renderTable() {
    const {
      resources
    } = this.state;

    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>name</Table.HeaderCell>
            <Table.HeaderCell>src</Table.HeaderCell>
            <Table.HeaderCell>type</Table.HeaderCell>
            <Table.HeaderCell>preload</Table.HeaderCell>
            <Table.HeaderCell>weight</Table.HeaderCell>
            <Table.HeaderCell>delete</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {resources.map((resource, index) => this.renderItem(resource, index))}
        </Table.Body>
      </Table>
    );
  }

  private renderItem(item: IResourceEntry, index: number) {
    const {
      preload,
      name,
      src,
      type,
      weight
    } = item;

    return (
      <Table.Row key={index}>
        <Table.Cell>
          <Input
            value={name}
            onChange={(e, data) => this.handleChangeItem(index, 'name', data.value)}
          />
        </Table.Cell>
        <Table.Cell>
          <Input
            value={src}
            onChange={(e, data) => this.handleChangeItem(index, 'src', data.value)}
          />
        </Table.Cell>
        <Table.Cell>
          <Select
            value={type}
            options={[
              {key: 'image', value: 'image', text: 'image'},
              {key: 'video', value: 'video', text: 'video'},
              {key: 'audio', value: 'audio', text: 'audio'}
            ]}
          />
        </Table.Cell>
        <Table.Cell>
          <Radio
            toggle
            checked={preload}
            onChange={() => this.handleChangeItem(index, 'preload', !preload)}
          />
        </Table.Cell>
        <Table.Cell>
          <Input
            type={'number'}
            value={weight}
            onChange={(e, data) => this.handleChangeItem(index, 'weight', parseFloat(data.value))}
          />
        </Table.Cell>
        <Table.Cell>
          <Button onClick={() => this.handleDelete(index)}>
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

render(
  <Demo />,
  document.getElementById('container')
);
