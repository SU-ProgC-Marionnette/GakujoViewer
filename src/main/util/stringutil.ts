export class StringUtil {
	static toDateArray(str: string): Date[] | null{
		//strに含まれる日付を全部抽出して配列に返す
		const dateArray = str.match(/\d{4}\/\d{1,2}\/\d{1,2} \d{2}:\d{2}/g);
		
		if(dateArray != null){
			const resultArray: Date[] = new Array(dateArray.length);
			for(let i:number=0;i<dateArray.length;i++){
				const detailArray=dateArray[i].match(/\d{1,4}/g);
				if(detailArray != null){
					const year  :number = Number(detailArray[0]);
					const month :number = Number(detailArray[1]);
					const day   :number = Number(detailArray[2]);
					const hour  :number = Number(detailArray[3]);
					const minute:number = Number(detailArray[4]);
					resultArray[i] = new Date(year,month - 1,day,hour,minute);
				}
			}
			return resultArray;
		}
		return null;
	}

	static getBody(str: string): string{
		//strから[重要]な(未読)みたいな付加情報を消したものを返す
		/*
		if(this.isImportant(str)){
			//str = str.substring(4);
		}
		if(this.isRead(str)){
			//str = str.substring(0,str.length-5);
		}
		*/
		str = str.replace(/^（未読）/,"");
		str = str.replace(/【重要】$/,"");
		return str;
	}

	static isRead(str: string):boolean{
		//strが(未読)で終わるか
		/*
		let unRead: string ="（未読）";
		if(str.substring(str.length-4,str.length-1) === unRead){
			return true;
		}else{
			return false;
		}
		*/
		//if(str.match(/（未読）/) != null){
		/*
		if(str.match(/^.*(?<!（未読）)$/) == null){
				return true;
		}else{
			return false;
		}
		*/
		return /^.*(?<=（未読）)$/.test(str);
	}

	static isImportant(str: string):boolean{
		//strが[重要]で始まるか
		/*
		let important="【重要】";
		if(str.substring(0,4) === important){
			return true;
		}else{
			return false;
		}
		*/
		/*
		if(str.match(/^(?!【重要】).*$/) == null){
			return true;
		}else{
			return false;
		}
		*/
		return /^(?=【重要】).*$/.test(str);
	}
}
