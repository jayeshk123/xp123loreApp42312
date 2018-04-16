//
//  nativeInnernewsTableViewController.swift
//  TestWV
//
//  Created by earth on 25/09/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import Toaster
import GRDB
import NVActivityIndicatorView
import CoreLocation

var expandedRowIndex : Int = 0

class nativeInnerNewsTableViewController: UITableViewController {

    struct News{
        var newstitle:String
        var excerpt:String
        var date:String
        var link:String
        var image:String
        var uniqueID:String
        var last_updated:String
    }
    var news:[News] = []
    var URL = "http://34.231.31.72/xplore/index.php"
    var dbQueue: DatabaseQueue!
    
    func setUpDatabasePath()
    {
        let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first! as NSString
        let databasePath = documentsPath.appendingPathComponent("sqliteDB.sqlite")
        print("DATABASE PATH !!!!")
        print(databasePath)
        let fileManager:FileManager = FileManager.default
        var success = fileManager.fileExists(atPath: databasePath)
        if (success)
        {
            dbQueue = try! DatabaseQueue(path: databasePath)
            print("writing to documents directory")
            print(databasePath)
            //break
            return
        }
        if (!success)
        {
            let bundlePath = Bundle.main.path(forResource: "sqliteDB", ofType: "sqlite")
            success = fileManager.fileExists(atPath: bundlePath!)
            print("writing from app bundle")
            if (success)
            {
                try! fileManager.copyItem(atPath: bundlePath!, toPath: databasePath)
                dbQueue = try! DatabaseQueue(path: databasePath)
            }
            else
            {
                print("Could not find database")
            }
            return
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.backgroundColor = UIColor.black
        setUpDatabasePath()
        getData()
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }
    
    func getData(){
        let newURL = "/site/News_list?callback"
        
        Alamofire.request(self.URL + newURL).responseString { response in
            print("Request: \(String(describing: response.request))")   // original url request
            print("Response: \(String(describing: response.response))") // http url response
            print("Result: \(response.result)")
            // response serialization result
            
            if let json = response.data {
                let data = JSON(data: json)
                print(data)
                if(data.count > 0){
                    for i in 0..<data.count{
                        let id : String = data[i]["sr_no"].stringValue
                        print(id)
                        let Title : String = data[i]["Title"].stringValue
                        print(Title)
                        let Excerpt : String = data[i]["Excerpt"].stringValue
                        print(Excerpt)
                        let Link : String = data[i]["Link"].stringValue
                        print(Link)
                        let Date : String = data[i]["Date"].stringValue
                        let lastDate : String = data[i]["last_updated"].stringValue
                        let Image : String = data[i]["Image"].stringValue
                        
                        
                        
                        
                        print("Image \(Image)")
                        let trimmedString = Image.replacingOccurrences(of: " ", with: "%20")
                        
                        self.news.append(News(newstitle: Title, excerpt: Excerpt, date: Date, link: Link, image : trimmedString, uniqueID: id, last_updated: Date))
                    }
                }
                self.tableView.reloadData()
            }
        }
    }
    
    func getDataFromUrl(url: URL, completion: @escaping (_ data: Data?, _  response: URLResponse?, _ error: Error?) -> Void) {
        URLSession.shared.dataTask(with: url) {
            (data, response, error) in
            completion(data, response, error)
            }.resume()
    }


    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return news.count
    }
    
    func loadURL(_recognizer:UITapGestureRecognizer){
        
        //using sender, we can get the point in respect to the table view
        let tapLocation = _recognizer.location(in: self.tableView)
        
        //using the tapLocation, we retrieve the corresponding indexPath
        let indexPath = self.tableView.indexPathForRow(at: tapLocation)
        
        //finally, we print out the value
        print(indexPath?.row as Any)
        
        //we could even get the cell from the index, too
        //let cell = self.tableView.cellForRow(at: indexPath!)
        //cell.textLabel?.text = "Hello, Cell!"
        
        let optionalString = _recognizer.view?.tag
        
        // now unwrap it
        if let unwrapped = optionalString {
            print(unwrapped)
            
        }

        let aWebView = UIWebView()
        
        let myUrl = NSURL(string: news[(indexPath?.row)!].link)
        let urlRequest = URLRequest(url: myUrl! as URL)
        
        aWebView.loadRequest(urlRequest)
        
        self.view.addSubview(aWebView)
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if(expandedRowIndex != -1 && indexPath.row == expandedRowIndex){
            let cell = Bundle.main.loadNibNamed("NewsCell", owner: self, options: nil)?.first as! NewsCell
            
            //        cell.backgroundColor = UIColor.black
            
            
            
            //cell.mainImage.image = UIImage(named: "event_img1")
            //cell.downArrowImage.contentMode = .scaleAspectFit
            cell.titleLabel.text = news[indexPath.row].newstitle
            cell.addressLabel.text = news[indexPath.row].link
            cell.mainContent.text = news[indexPath.row].excerpt
            cell.dateLabel.text = news[indexPath.row].date
            cell.mainImage.layer.cornerRadius = 20.0
            cell.buyNowBtn.tag = indexPath.row
            var tapped:UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(loadURL(_recognizer:)))
            tapped.numberOfTapsRequired = 1
            cell.buyNowBtn.addGestureRecognizer(tapped)
            cell.layer.cornerRadius = 20.0
            let trimmedString = news[indexPath.row].image
            var img = "https://s3.amazonaws.com/retail-safari/" + trimmedString
            
            print(img)
            let imageUrl = NSURL(string: img)! as URL
            print("Download Started")
            print(imageUrl);
            self.getDataFromUrl(url: imageUrl) { (data, response, error)  in
                guard let data = data, error == nil else { return }
                print(response?.suggestedFilename ?? imageUrl.lastPathComponent)
                print("Download Finished")
                DispatchQueue.main.async() { () -> Void in
                    
                    if(UIImage(data:data) != nil){
                        
                        cell.mainImage.image = UIImage(data: data)
                        //cell.leftImage.contentMode = .scaleAspectFit
                    }else{
                        //self.imageArray.append(UIImage(named: "nature")!)
                        //cell.leftImage.contentMode = .scaleAspectFit
                    }
                }
            }
            cell.alpha = 0.2
            
            UIView.animate(withDuration: 0.75, animations: {
                //self.view.layoutIfNeeded()
                cell.alpha = 1
            })
            return cell
        }else{
            let cell = Bundle.main.loadNibNamed("EventsCollapsedCell", owner: self, options: nil)?.first as! EventsCollapsedCell
            
            //        cell.backgroundColor = UIColor.black
            
            
            let trimmedString = news[indexPath.row].image
            //cell.mainImage.image = UIImage(named: "event_img1")
            //cell.downArrowImage.contentMode = .scaleAspectFit
            cell.titleLabel.text = news[indexPath.row].newstitle
            cell.addressLabel.text = news[indexPath.row].link
            cell.mainContent.text = news[indexPath.row].excerpt
            cell.dateLabel.text = news[indexPath.row].date
            cell.layer.cornerRadius = 20.0
            cell.mainImage.layer.cornerRadius = 20.0
            
            var img = "https://s3.amazonaws.com/retail-safari/" + trimmedString
            
            print(img)
            let imageUrl = NSURL(string: img)! as URL
            print("Download Started")
            print(imageUrl);
            self.getDataFromUrl(url: imageUrl) { (data, response, error)  in
                guard let data = data, error == nil else { return }
                print(response?.suggestedFilename ?? imageUrl.lastPathComponent)
                print("Download Finished")
                DispatchQueue.main.async() { () -> Void in
                    
                    if(UIImage(data:data) != nil){
                        if(cell.mainImage.image == UIImage(named:"event_img1") || cell.mainImage.image == nil){
                            cell.mainImage.image = UIImage(data: data)
                        }
                        
                        //                            cell.leftImage.contentMode = .scaleAspectFit
                    }else{
                        //self.imageArray.append(UIImage(named: "nature")!)
                        //cell.leftImage.contentMode = .scaleAspectFit
                    }
                }
            }
            cell.alpha = 0.2
            
            UIView.animate(withDuration: 0.75, animations: {
                //self.view.layoutIfNeeded()
                cell.alpha = 1
            })

            return cell
        }
        
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if expandedRowIndex != indexPath.row{
            expandedRowIndex = indexPath.row
        }else{
            expandedRowIndex = -1
        }
        
        print(expandedRowIndex)
        //self.tableView.beginUpdates()
        
        self.tableView.reloadData()
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if(indexPath.row != -1 && indexPath.row == expandedRowIndex){
            return 565.0
        }else{
            return 465.0
        }
    }

}
