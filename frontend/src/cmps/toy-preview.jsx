
export function ToyPreview({toy}){

    return (
        <div className="toy-preview">
            <h2>{toy.name}</h2>
            <div className="img-container"><img width={'200px'} src={require(`../assets/img/${toy.imgUrl?toy.imgUrl: 'default-toy' }.png`)} /></div>
            <h3>${toy.price}</h3>
            <ul className="preview-labels"> 
                {toy.labels.map((label,idx) => <li key={toy._id+label+idx}>{label}</li>)}
            </ul>
        </div>
    )
}