import * as React from "react";


class LeftPanel extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {

        let cardStyle = {
            padding:5,
            borderRadius:5,
            color:'rgb(50,50,50)',
            backgroundColor:'rgb(220,220,220)'
        }

        return(
            <>
                <div style={cardStyle}>
                    Price(USD) <br/>
                    <input style={{
                        width:'100%'
                    }} type={'range'} min={0} max={10000} step={50} onChange={(event)=>{
                        this.props.updateBoard({
                            price: event.target.value
                        });
                    }}/><br/>
                    ${this.props.data.price / 100} USD
                </div>

                <br/>

                <div style={cardStyle}>
                    Conversion <br/>
                    <input style={{
                        width:'100%'
                    }} type={'range'} min={0} max={1000} step={10} onChange={(event)=>{
                        this.props.updateBoard({
                            conversion: event.target.value
                        });
                    }}/><br/>
                    {this.props.data.conversion / 100.00} %
                </div>

                <br/>

                <div style={cardStyle}>
                    Retention <br/>
                    <input style={{
                        width:'100%'
                    }} type={'range'} min={8000} max={10000} step={10} onChange={(event)=>{
                        this.props.updateBoard({
                            retention: event.target.value
                        });
                    }}/><br/>
                    {this.props.data.retention / 100.00} %
                </div>

                <br/>

                <div style={cardStyle}>
                    Promo <br/>
                    <input style={{
                        width:'100%'
                    }} type={'range'} min={0} max={10000} step={100} onChange={(event)=>{
                        this.props.updateBoard({
                            promo: event.target.value
                        });
                    }}/><br/>
                    {this.props.data.promo}
                </div>

                <br/>

                <div style={{
                    padding:5,
                    borderRadius:5,
                    color:'rgb(230,230,230)',
                    backgroundColor:'rgb(0,90,220)',
                    textAlign:'center'
                }} onClick={()=>{
                    this.props.updateBoard({
                        completed:true
                    })
                }}>
                    Go
                </div>
            </>
        );
    }
}

class TableController extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            columns:["Period", "NC", "ECR", "TC", "REC", "RNC", "TR", "AR", "XC", "ER", "AER"],
            periods:100,
            mouseRow:-1
        }
    }

    runEngine(field, period){
        let dollarUSLocale = Intl.NumberFormat('en-US');
        const engine = {
            "Period": per=>per,
            "NC": _=>(this.props.data.conversion/10000)*this.props.data.promo,
            "ECR": per=>(per === 0) ? 0 : (engine["ECR"](per-1)+engine["NC"](per-1))*(this.props.data.retention/10000),
            "TC": per=>engine["NC"](per)+engine["ECR"](per),
            "REC": per=>engine["ECR"](per)*(this.props.data.price/100),
            "RNC": per=>engine["NC"](per)*(this.props.data.price/100),
            "TR": per=>engine["REC"](per)+engine["RNC"](per),
            "AR": per=>engine["TR"](per) + ((per===0) ? 0 : engine["AR"](per-1)),
            "XC": per=>engine["TR"](per)*(1-this.props.data.grossMargin),
            "ER": per=>engine["TR"](per)*(this.props.data.netMargin),
            "AER": per=>engine["ER"](per) + ((per===0) ? 0 : engine["AER"](per-1)),
        }
        let result = engine[field](period);
        let floatFields=["REC","RNC","TR","AR","XC","ER","AER"];
        if(floatFields.includes(field)){
            return "$ "+ dollarUSLocale.format(result.toFixed(2));
        }
        return result.toFixed(0);

    }

    render() {
        return(
            <>

                <div style={{
                    display:'flex',
                    justifyContent:'space-evenly',
                    width:'100%'
                }}>
                    {this.state.columns.map(c=>{
                        return <div style={{
                            backgroundColor:'rgb(240,240,240)',
                            width:'100%',
                            padding:10
                        }}>{c}</div>
                    })}

                </div>
                {Array(this.state.periods).fill(0).map((_,i)=>{
                    return(
                        <div onMouseEnter={()=>{
                            this.setState({
                                mouseRow:i
                            })
                        }} on onMouseLeave={()=>{
                            this.setState({
                                mouseRow:-1
                            })
                        }} style={{
                            display:'flex',
                            justifyContent:'space-evenly',
                            width:'100%',
                            backgroundColor:(this.state.mouseRow === i) ? 'rgb(0,90,255)':'rgb(255,255,255)',
                            color:(this.state.mouseRow === i) ? 'rgb(255,255,255)':'rgb(0,0,0)'
                        }}>
                            {this.state.columns.map(c=>{
                                return <div style={{
                                    paddingTop:5,
                                    paddingBottom:5,
                                    width:'100%',
                                    borderTop:'1.5px solid #bbb'
                                }}>{this.runEngine(c, i)}</div>
                            })}



                        </div>
                    );
                })}
            </>
        );
    }
}

function Placeholder() {
    return(
        <div>
            "Click go to display table!"
        </div>
    );
}


class DashboardController extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            completed:false,
            price:0.0,
            conversion:0.0,
            retention:0.0,
            promo:0,
            grossMargin:.8,
            netMargin:.7
        }
    }

    render() {
        return(
            <div style={{
                display:'flex',
                fontFamily:'Sans-serif',
                fontSize:'75%'
            }}>
                <div style={{
                    flex:2,
                    padding:10

                }}>
                    <LeftPanel data={this.state} updateBoard={(data)=>{
                        this.setState(data);
                    }}/>
                </div>

                <div style={{
                    flex:0.5,
                }}/>

                <div style={{
                    flex:8,
                }}>
                    {this.state.completed ? <TableController data={this.state} /> : <Placeholder></Placeholder> }
                </div>

                <div style={{
                    flex:0.5,
                }}/>

            </div>
        );
    }
}



export class Main extends React.Component {
    render() {
        return (
            <DashboardController/>
        );
    }
}




