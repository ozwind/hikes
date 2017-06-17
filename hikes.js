var hikes = hikes || new Hikes();

function Hikes() {
    this.init = function () {
        for (var i = 0; i < data.length; i++) {
            var photos = "<td>";
            if (data[i].photos && data[i].photos.length > 0) {
                for (j = 0; j < data[i].photos.length; j++) {
                    photos += "<a href='" + data[i].photos[j] +
                        "'><img src='" + data[i].photos[j] +
                        "'></a>";
                }
            }
            photos += "</td>";

            var morePhotos = "";
            if (data[i].morePhotos && data[i].morePhotos.length > 0) {
                morePhotos = "<br><br><a href='" + data[i].morePhotos + "'>Photos</a>";
            }

            var html = "<tr>" +
                "<td class='date'>" + data[i].date + "</td>" +
                "<td class='duration'>" + data[i].duration + "</td>" +
                "<td class='miles'>" + data[i].miles.toFixed(1) + "</td>" +
                "<td class='mph'>" + data[i].mph.toFixed(1) + "</td>" +
                "<td class='trail'><a href='" + data[i].url + "'>" + data[i].trail + "</a></td>" +
                "<td class='conditions'>" + data[i].conditions + morePhotos + "</td>" +
                photos +
                "</tr>";
            $("#tdata").append(html);
        }
    }
}

var data = [
    {
        date: '6/12/2017',
        duration: '3:13',
        miles: 8.9,
        mph: 2.8,
        trail: 'Pipeline',
        url: 'https://www.alltrails.com/explore/recording/pipeline--65',
        morePhotos: 'https://chewi0.smugmug.com/Pipeline-2017/',
        conditions: 'Mostly sunny 59&deg;-75&deg;',
        photos: ['https://photos.smugmug.com/Pipeline-2017/i-K9sWpqJ/0/c6d9d65d/X2/IMG_3658-X2.jpg','https://photos.smugmug.com/Pipeline-2017/i-RgWkpmV/0/a0e3225d/X2/IMG_3639-X2.jpg']
    },
    {
        date: '6/3/2017',
        duration: '2:27',
        miles: 7.3,
        mph: 3.0,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--108',
        conditions: 'Partly cloudy 68&deg;-72&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19241263/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19241261/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/29/2017',
        duration: '3:21',
        miles: 8.9,
        mph: 2.6,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--107',
        conditions: 'Cloudy 60&deg;-68&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19223331/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19223330/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/20/2017',
        duration: '3:22',
        miles: 9.0,
        mph: 2.7,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/wier-santiago',
        conditions: 'Sunny 72&deg;-90&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19186885/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19186886/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '5/06/2017',
        duration: '2:32',
        miles: 7.5,
        mph: 2.9,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--106',
        conditions: 'Cloudy 65&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19145615/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19145617/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/29/2017',
        duration: '3:33',
        miles: 10.6,
        mph: 3.0,
        trail: 'Carbon Canyon',
        url: 'https://www.alltrails.com/explore/recording/carbon-canyon--32',
        conditions: 'Sunny, windy, 75&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19126227/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19126218/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '4/21/2017',
        duration: '3:26',
        miles: 9.4,
        mph: 2.9,
        trail: 'Santiago Oaks',
        url: 'http://www.mapmyhike.com/workout/2141671064',
        conditions: 'Sunny 65&deg;-85&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-pW7Nm8s/0/c4fd0a79/X2/IMG_3527-X2.jpg']
    },
    {
        date: '4/15/2017',
        duration: '3:36',
        miles: 10.0,
        mph: 2.9,
        trail: 'Weir Santiago',
        url: 'http://www.mapmyhike.com/workout/2128475384',
        conditions: 'Sunny',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-pKGNnwh/0/080d0888/X2/IMG_3504-X2.jpg']
    },
    {
        date: '4/9/2017',
        duration: '1:49',
        miles: 4.0,
        mph: 2.2,
        trail: 'Charleston, SC',
        morePhotos: 'https://chewi0.smugmug.com/Charleston-2017/',
        url: 'http://www.mapmyhike.com/workout/2114944868',
        conditions: 'Sunny',
        photos: ['https://photos.smugmug.com/Charleston-2017/i-PZPv3Gz/0/be4cc1e1/X2/IMG_3485-X2.jpg','https://photos.smugmug.com/Charleston-2017/i-fWwRncm/0/e8a14dc9/X2/IMG_3479-X2.jpg']
    },
    {
        date: '4/1/2017',
        duration: '3:19',
        miles: 9.7,
        mph: 3.0,
        trail: 'Weir Santiago',
        url: 'http://www.mapmyhike.com/workout/2097822530',
        conditions: 'Sunny 65&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-Z2PTnh3/0/2e4ab7bf/X2/IMG_3287-X2.jpg']
    },
    {
        date: '3/26/2017',
        duration: '3:16',
        miles: 8.9,
        mph: 2.7,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--4',
        conditions: 'Partly cloudy 62&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/19029413/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/19029412/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '3/20/2017',
        duration: '3:54',
        miles: 10.7,
        mph: 2.9,
        trail: 'Santiago Oaks',
        url: 'http://www.mapmyhike.com/workout/2073413747',
        conditions: 'Cloudy 60&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-HKvmmVn/0/6ac1fc44/X2/IMG_3240-X2.jpg','https://photos.smugmug.com/Santiago-Oaks-2017/i-8MCBsnk/0/fe88de43/X2/IMG_3255-X2.jpg']
    },
    {
        date: '3/18/2017',
        duration: '2:54',
        miles: 8.3,
        mph: 2.9,
        trail: 'Santiago Oaks',
        url: 'http://www.mapmyhike.com/workout/2069622365',
        conditions: 'Mostly sunny 70&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-vWVS49G/0/72f9cdda/X2/IMG_3207-X2.jpg','https://photos.smugmug.com/Santiago-Oaks-2017/i-ntrRJ5j/0/8d320a8b/X2/IMG_3203-X2.jpg']
    },
    {
        date: '3/12/2017',
        duration: '2:59',
        miles: 8.5,
        mph: 2.9,
        trail: 'Santiago Oaks',
        url: 'http://www.mapmyhike.com/workout/2058980468/',
        conditions: 'Sunny 70&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-fsLJp2p/0/edb35366/X2/IMG_3191-X2.jpg']
    },
    {
        date: '3/6/2017',
        duration: '2:49',
        miles: 7.9,
        mph: 2.8,
        trail: 'Santiago Oaks',
        url: 'http://www.mapmyhike.com/workout/2047464806',
        conditions: 'Sunny 60&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-QVCLn4K/0/6a3521c7/X2/IMG_3181-X2.jpg','https://photos.smugmug.com/Santiago-Oaks-2017/i-7JpCLBv/0/70a26eb0/X2/IMG_3172-X2.jpg']
    },
    {
        date: '3/4/2017',
        duration: '3:13',
        miles: 10.0,
        mph: 3.1,
        trail: 'Weir Santiago',
        url: 'http://www.mapmyhike.com/workout/2043857987',
        conditions: 'Overcast 63&deg;',
        photos: ['https://photos.smugmug.com/Santiago-Oaks-2017/i-fg4L3BC/0/efbf0a66/X2/IMG_3156-X2.jpg']
    },
    {
        date: '2/25/2017',
        duration: '3:14',
        miles: 9.0,
        mph: 2.8,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--3',
        conditions: 'Sunny 48&deg;-60&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/18218531/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/18218525/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '2/12/2017',
        duration: '2:39',
        miles: 5.8,
        mph: 2.2,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--98',
        conditions: 'Sunny 68&deg;, muddy',
        photos: ['https://www.alltrails.com/api/alltrails/photos/18012764/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/18012750/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '2/5/2017',
        duration: '3:18',
        miles: 8.9,
        mph: 2.7,
        trail: 'Weir Santiago',
        url: 'https://www.alltrails.com/explore/recording/weir-santiago--2',
        conditions: 'Cloudy misty 57&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/17821656/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/17821655/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/29/2017',
        duration: '2:54',
        miles: 7.4,
        mph: 2.6,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--96',
        conditions: 'Sunny 77&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/17729885/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/17729886/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/15/2017',
        duration: '2:53',
        miles: 7.5,
        mph: 2.6,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--89',
        conditions: 'Mostly cloudy 58&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/17188161/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/17188154/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '1/8/2017',
        duration: '2:40',
        miles: 7.2,
        mph: 2.7,
        trail: 'Santiago Oaks',
        url: 'https://www.alltrails.com/explore/recording/santiago-oaks--86',
        conditions: 'Mostly sunny 72&deg;',
        photos: ['https://www.alltrails.com/api/alltrails/photos/16799731/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/16799727/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '9/10/2016',
        duration: '2:52',
        miles: 7.2,
        mph: 2.5,
        trail: 'Jones',
        url: 'https://www.alltrails.com/explore/recording/jones--10',
        conditions: 'Sunny',
        photos: ['https://www.alltrails.com/api/alltrails/photos/13360607/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/13360612/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/18/2016',
        duration: '6:27',
        miles: 13.9,
        mph: 2.1,
        trail: 'Mt. Whitney',
        url: 'https://www.alltrails.com/explore/recording/whitney-4--2',
        morePhotos: 'https://chewi0.smugmug.com/Whitney-2016/',
        conditions: 'Sunny',
        photos: ['https://www.alltrails.com/api/alltrails/photos/12134576/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/12134571/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '8/14/2016',
        duration: '2:16',
        miles: 5.3,
        mph: 2.3,
        trail: 'Onion Valley',
        url: 'https://www.alltrails.com/explore/recording/onion-valley--10',
        conditions: 'Sunny',
        photos: ['https://www.alltrails.com/api/alltrails/photos/12135505/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/12135500/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '7/2/2016',
        duration: '3:58',
        miles: 9.7,
        mph: 2.4,
        trail: 'Mt. Baldy',
        url: 'https://www.alltrails.com/explore/recording/baldy--66',
        morePhotos: 'https://chewi0.smugmug.com/Baldy-2016/',
        conditions: 'Sunny',
        photos: ['https://www.alltrails.com/api/alltrails/photos/11680953/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/11680952/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },
    {
        date: '6/19/2016',
        duration: '1:15',
        miles: 3.3,
        mph: 2.7,
        trail: 'Castlewood',
        url: 'https://www.alltrails.com/explore/recording/castlewood--33',
        conditions: 'Sunny',
        morePhotos: 'https://chewi0.smugmug.com/St-Louis-2016/',
        photos: ['https://www.alltrails.com/api/alltrails/photos/11602608/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i','https://www.alltrails.com/api/alltrails/photos/11602607/image?size=extra_large&api_key=3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i']
    },

];
