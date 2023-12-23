export class StringUtil {
	toDateArray(str: string): Date[] | null{
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
					resultArray[i] = new Date(year,month,day,hour,minute);
				}
			}
			return resultArray;
		}
		return null;
	}

	getBody(str: string): string{
		//strから[重要]な(未読)みたいな付加情報を消したものを返す
		if(this.isImportant(str)){
			const result = str.match(/[^【重要】]+/);//正規表現ver
			if(result != null){
				str = result.join('');
			}
			
			
			//str = str.substring(4);
		}else if(this.isRead(str)){
			const result = str.match(/[^（未読）]+/);//正規表現ver
			if(result != null){
				str = result.join('');
			}
			
			//str = str.substring(0,str.length-5);
		}
		return str;
	}

	isRead(str: string):boolean{
		//strに(未読)が含まれているか
		/*
		let unRead: string ="（未読）";
		if(str.substring(str.length-4,str.length-1) === unRead){
			return true;
		}else{
			return false;
		}
		*/
		if(str.match(/（未読）/) != null){
			return true;
		}else{
			return false;
		}
	}

	isImportant(str: string):boolean{
		//strに[重要]が含まれているか
		/*
		let important="【重要】";
		if(str.substring(0,4) === important){
			return true;
		}else{
			return false;
		}
		*/
		if(str.match(/【重要】/) != null){
			return true;
		}else{
			return false;
		}
	}
}
