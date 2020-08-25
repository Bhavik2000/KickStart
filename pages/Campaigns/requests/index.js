import React, {Component} from 'react';
import Layout from '../../../components/Layout';
import {Button, Table} from 'semantic-ui-react';
import {Link} from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component{

    static async getInitialProps(props){
        const {address} = props.query;

        const campaign = Campaign(address);
        const requestCount = await campaign.methods.gerRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();
        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill()
                .map((element,index)=>{
                    return campaign.methods.requests(index).call();
                })
        );
        
        return {address, requests, requestCount, approversCount};
    }

    renderRows(){
        return(
            this.props.requests.map((request,index) => {
                return(
                    <RequestRow 
                        key={index}
                        id={index}
                        request={request}
                        address={this.props.address}
                        approversCount={this.props.approversCount}
                    />
                );
            })
        );
    }

    render(){
        const { Header, HeaderCell, Cell, Body , Row} = Table;
        return(
            <Layout >
                <h2 floated="left">Requests ::</h2>
                <Link route={`/Campaigns/${this.props.address}/requests/new`}><a>
                    <Button primary floated="right" style={{marginBottom: 10}}>Add request</Button>
                </a>
                </Link>
                <Table celled>
                    <Header>
                        <Row>
                            <HeaderCell>Id</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount(ether)</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>                            
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} requests</div>
            </Layout>
        );
    }
}

export default RequestIndex;