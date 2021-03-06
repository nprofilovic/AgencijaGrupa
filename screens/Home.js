import React, { Component } from 'react'
import { FlatList, ImageBackground,Dimensions,ScrollView, TouchableOpacity, ActivityIndicator, } from 'react-native'
import {Constants, Colors, View, Card, Button, Text, Image} from 'react-native-ui-lib'; 
import { datas } from '../data';
import Header from '../components/Header';
import Banner from '../components/Banner';
import FotoBanner from '../components/FotoBanner';
import { styles } from '../style';
import axios from 'axios';

const { width, height } = Dimensions.get('screen');



export class Home extends Component {
    
    static navigationOptions = {
        header: (
            <Header />  
        )
    }

    state = {
        loading: false,
        page: 1,
        refreshing: false,
        datas: [],
        portfolio: [],
        news: []
    }
    componentDidMount() {
        this.fetchData();
        this.fetchPortfolio();
        this.fetchNews();
        
        
      
    }

   
    fetchData = async () => {
        const { page } = this.state;
        console.log("All Good");
        
        const url = `http://grupa.co.rs/wp-json/wp/v2/nectar_slider?page=${page}&per_page=4`;
 
        this.setState({ loading: true });
        await fetch(url)
        .then(res => { 
            return res.json()
        })
        .then(res => {
            const arrayData = [...this.state.datas, ...res]
            this.setState({
            datas: page === 1 ? res : arrayData,
            loading: false,
            refreshing: false
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
        
    }

    fetchPortfolio = () => {
        const { page } = this.state;
        const url = `http://grupa.co.rs/wp-json/wp/v2/portfolio?page=${page}&per_page=5&project-type=20`
        this.setState({ loading: true });
        fetch(url)
        .then(res => { 
          return res.json()
          
        })
        .then(res => {
          const arrayData = [...this.state.portfolio, ...res]
          this.setState({
            portfolio: page === 1 ? res : arrayData,
            loading: false,
            refreshing: false
          });
          console.log("Portfolio Posts");
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false });
        });
    }

   
    fetchNews = () => {
        axios.get(`http://grupa.co.rs/wp-json/wp/v2/posts`)
        .then(res => {
            this.setState({news: res.data});
        })
    }
    
    renderArticles = () => {
        return (
            <View style={[styles.flex, styles.column, styles.articleStaffs]}>
                <FlatList 
                    horizontal
                    scrollEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    snapToAlignment="center"
                    data={this.state.datas}
                    style={styles.flatlist}
                    keyExtractor={(item, index) => `${item.id}` }
                    renderItem={({ item }) => this.renderArticle(item)}
                    
                    
                />
            </View>
        );
    }
    renderArticle = (item) => {  
        return(
    
                <ImageBackground 
                        style={[ styles.flex, styles.articleStaff]}
                        imageStyle={{borderRadius: 12}}
                        source={{ uri: item._nectar_slider_image }} 
                    >
                    <View style={[styles.column, styles.articleInfo, styles.shadow, ]}>
                        <Text style={{fontWeight: '500', fontSize: 18, paddingBottom: 8}}>{item._nectar_slider_heading}</Text>
                        <Text style={{color:'grey', fontSize:12, }}>{item._nectar_slider_caption}</Text>
                    </View>
                </ImageBackground>
                
                
           
            
        )
    }

    

    renderRecommended = () => {
        return (
            <View style={[styles.flex, styles.column, styles.recommended]}>
                <View style={[styles.row, styles.recommendedList]}>
                    <Text style={{fontSize: 18}}>Web sajtovi</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('WebSites',{websites: this.state.portfolio, fetchData: this.fetchPortfolio()})}>
                        <Text style={{color: 'grey'}}>More</Text>
                    </TouchableOpacity>
                    
                </View>
                <View style={[styles.column ]}>
                    <FlatList 
                        horizontal
                        pagingEnabled
                        scrollEnabled
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        snapToAlignment="center"
                        data={this.state.portfolio}
                        style={[styles.shadow, {overflow: 'visible'}]}
                        keyExtractor={(item, index) => `${item.id}` }
                        renderItem={({ item }) => this.renderRecommendation(item)}
                        
                    />
                </View>
            </View>
            
        );
    }

    renderRecommendation = (item, index) => {
        const { portfolio } = this.state;
        const isLastItem = index === portfolio.length - 1;
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Portfolio', {portfolio: item})}>
                <View style={[
                    styles.column, styles.recommendation, styles.shadow, 
                    index === 0 ? { marginLeft: 36 } : null,
                    isLastItem ? { marginRight: 36 } : null,
                ]}>
                    <View style={[styles.flex, styles.recommendationHeader]}>
                        <Image style={[ styles.flex, styles.recommendedImage ]} source={{ uri: item.featured_image_src }} />
                        <View style={[styles.flex, styles.row, styles.recommendationOptions]}>

                        </View>
                    </View>
                    
                    <View style={[styles.flex, styles.column, styles.shadow, {justifyContent: 'space-evenly',  paddingTop:18 }]}>
                        <Text>{item.title.rendered.split('').slice(0, 20)}...</Text>

                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderNews = () => {
        return (
            <View style={[styles.flex, styles.column, styles.recommended]}>
                <View style={[styles.row, styles.recommendedList]}>
                    <Text style={{fontSize: 18}}>Vesti</Text>
                    <Text style={{color: 'grey'}}>More</Text>
                </View>
                <View style={[styles.column, ]}>
                    <FlatList 
                        horizontal
                        pagingEnabled
                        scrollEnabled
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        snapToAlignment="center"
                        data={this.state.news}
                        style={[styles.shadow, {overflow: 'visible'}]}
                        keyExtractor={(item, index) => `${item.id}`}
                        renderItem={({ item }) => this.renderNewses(item)}
                    />
                </View>
            </View>
            
        );
    }

    renderNewses = (item, index) => {
        const { news } = this.state;
        const isLastItem = index === news.length - 1;
        
        
        return (
            
            
            <TouchableOpacity onPress={() => this.props.navigation.navigate('News', {news: item})}>
                <View style={[
                    styles.column, styles.recommendation, styles.shadow, 
                    index === 0 ? { marginLeft: 36 } : null,
                    isLastItem ? { marginRight: 18 } : null,
                ]}>
                    <View style={[styles.flex, styles.recommendationHeader]}>
                        <Image style={[ styles.flex, styles.recommendedImage ]} source={{ uri: item.featured_image_src }} />
                        <View style={[styles.flex, styles.row, styles.recommendationOptions]}>

                        </View>
                    </View>
                    
                    <View style={[styles.flex, styles.column, styles.shadow, {justifyContent: 'space-evenly',  paddingTop:18 }]}>
                        <Text>{item.title.rendered.split('').slice(0, 20)}...</Text>

                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
       
        
        return (
            <ScrollView style={[styles.article, styles.flex]}>
                {this.state.loading ? <ActivityIndicator size={'large'} color="#000000" /> : this.renderArticles()}
                <View style={styles.fotobanner}>
                    <FotoBanner />
                </View>
                
                {this.state.loading ? <ActivityIndicator size={'large'} color="#000000" style = {[styles.flex,styles.row, {paddingTop:110, margin:35}]} /> : this.renderRecommended()}
                <Banner 
                    image={'http://grupa.co.rs/wp-content/uploads/2019/08/social_networks.png'}
                    headerText={'Želite da se oglašavate na internetu?'}
                    bodyText={'Tu smo da vam pomognemo!'}
                    height={200}
                />
                {this.renderNews()}
                
            </ScrollView>
            
        )
    }
} 

Home.defaultProps = {
    articles: datas
}
export default Home
